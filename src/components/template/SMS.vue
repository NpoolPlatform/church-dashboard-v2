<template>
  <q-table
    dense
    flat
    :title='$t("MSG_SMS_TEMPLATES")'
    :rows='smss'
    row-key='ID'
    :loading='smsLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as SMSTemplate)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_SMS_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <div class='dark-bg'>
          <LangSwitcher v-model:language='language' :emit-result='true' :set-lang='false' />
        </div>
      </q-card-section>
      <q-card-section>
        <q-select :options='UsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Message' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { Language } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useChurchSMSTemplateStore, SMSTemplate, NotifyType, UsedFors } from 'npool-cli-v4'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const templates = useChurchSMSTemplateStore()
const smss = computed(() => templates.SMSTemplates.SMSTemplates.get(appID.value) ? templates.SMSTemplates.SMSTemplates.get(appID.value) : [])
const smsLoading = ref(true)

const prepare = () => {
  if (!templates.SMSTemplates.SMSTemplates.get(appID.value)) {
    getAppSMSTemplates(0, 500)
  }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as SMSTemplate)
const language = ref(undefined as unknown as Language)

const onMenuHide = () => {
  language.value = undefined as unknown as Language
  target.value = {} as unknown as SMSTemplate
}

const onRowClick = (template: SMSTemplate) => {
  target.value = template
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = (done: () => void) => {
  target.value.LangID = language.value.ID
  updating.value ? updateAppSMSTemplate(done) : createAppSMSTemplate(done)
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const getAppSMSTemplates = (offset: number, limit: number) => {
  templates.getAppSMSTemplates({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_TEMPLATES',
        Message: 'MSG_GET_EMAIL_TEMPLATES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (smsTemplates: Array<SMSTemplate>, error: boolean) => {
    if (error || smsTemplates.length < limit) {
      smsLoading.value = false
      return
    }
    getAppSMSTemplates(offset + limit, limit)
  })
}

const createAppSMSTemplate = (done: () => void) => {
  templates.createAppSMSTemplate({
    TargetAppID: appID.value,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_SMS_TEMPLATE',
        Message: 'MSG_CREATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: SMSTemplate, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
const updateAppSMSTemplate = (done: () => void) => {
  templates.updateAppSMSTemplate({
    TargetAppID: appID.value,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_SMS_TEMPLATE',
        Message: 'MSG_UPDATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: SMSTemplate, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
</script>
