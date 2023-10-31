<template>
  <q-table
    dense
    flat
    :title='$t("MSG_SMS_TEMPLATES")'
    :rows='templates'
    row-key='ID'
    :loading='smsLoading'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as smsnotiftemplate.Template)'
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
        <LanguagePicker v-model:language='target.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-select :options='basetypes.EventTypes' v-model='target.UsedFor' :disable='updating' :label='$t("MSG_USED_FOR")' />
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
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { smsnotiftemplate, notify, basetypes, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _sms = smsnotiftemplate.useSMSTemplateStore()
const templates = computed(() => _sms.templates(AppID.value)?.sort((a, b) => a.UsedFor.localeCompare(b.UsedFor, 'zh-CN')))
const smsLoading = ref(false)

const prepare = () => {
  if (!templates.value.length) {
    getAppSMSTemplates(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as smsnotiftemplate.Template)

const onMenuHide = () => {
  target.value = {} as unknown as smsnotiftemplate.Template
}

const onRowClick = (template: smsnotiftemplate.Template) => {
  target.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppSMSTemplate(done) : createAppSMSTemplate(done)
}

const getAppSMSTemplates = (offset: number, limit: number) => {
  _sms.getAppSMSTemplates({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_TEMPLATES',
        Message: 'MSG_GET_EMAIL_TEMPLATES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<smsnotiftemplate.Template>) => {
    if (error || !rows?.length) {
      smsLoading.value = false
      return
    }
    getAppSMSTemplates(offset + limit, limit)
  })
}

const createAppSMSTemplate = (done: () => void) => {
  _sms.createAppSMSTemplate({
    TargetAppID: AppID.value,
    TargetLangID: target.value.LangID,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_SMS_TEMPLATE',
        Message: 'MSG_CREATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const updateAppSMSTemplate = (done: () => void) => {
  _sms.updateAppSMSTemplate({
    TargetAppID: AppID.value,
    TargetLangID: target.value.LangID,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_SMS_TEMPLATE',
        Message: 'MSG_UPDATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.LangID
  },
  {
    name: 'Subject',
    label: t('MSG_SUBJECT'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.Subject
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.Message
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => row.UsedFor
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: smsnotiftemplate.Template) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
