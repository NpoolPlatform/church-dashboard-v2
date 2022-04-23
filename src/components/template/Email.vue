<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    row-key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as EmailTemplate)'
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
        <span>{{ $t('MSG_CREATE_EMAIL_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <div class='dark-bg'>
          <LangSwitcher v-model:language='language' :emit-result='true' />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.DefaultToUsername' :label='$t("MSG_DEFAULT_TO_USERNAME")' />
        <q-select :options='MessageUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
        <!-- q-input v-model='replyTos' :label='$t("MSG_REPLY_TOS_COMMA")' / -->
        <!-- q-input v-model='ccTos' :label='$t("MSG_CC_TOS_COMMA")' / -->
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Body' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, EmailTemplate, Language, MessageUsedFors, useChurchTemplateStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const templates = useChurchTemplateStore()
const emails = computed(() => templates.EmailTemplates.get(appID.value) ? templates.EmailTemplates.get(appID.value) : [])
const emailLoading = ref(true)

const prepare = () => {
  emailLoading.value = true
/*
  templates.getEmailTemplates({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_TEMPLATES',
        Message: 'MSG_GET_EMAIL_TEMPLATES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    emailLoading.value = false
  })
*/
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as EmailTemplate)
/*
const replyTos = computed({
  get: () => target.value?.ReplyTos?.join(','),
  set: (val) => {
    target.value.ReplyTos = val.split(',')
  }
})
const ccTos = computed({
  get: () => target.value?.CCTos?.join(','),
  set: (val) => {
    target.value.CCTos = val.split(',')
  }
})
*/

const language = ref(undefined as unknown as Language)
watch(language, () => {
  target.value.LangID = language.value.ID
})

const onMenuHide = () => {
  language.value = undefined as unknown as Language
  target.value = {} as unknown as EmailTemplate
}

const onRowClick = (template: EmailTemplate) => {
  target.value = template
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  target.value.LangID = language.value.ID

  if (updating.value) {
    templates.updateEmailTemplate({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_EMAIL_TEMPLATE',
          Message: 'MSG_UPDATE_EMAIL_TEMPLATE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  templates.createEmailTemplate({
    TargetAppID: appID.value,
    TargetLangID: language.value.ID,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EMAIL_TEMPLATE',
        Message: 'MSG_CREATE_EMAIL_TEMPLATE_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
