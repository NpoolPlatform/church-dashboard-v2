<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='_templates'
    row-key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as MyEmailTemplate)'
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
        <LanguagePicker v-model:language='myTarget.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='myTarget.DefaultToUsername' :label='$t("MSG_DEFAULT_TO_USERNAME")' />
        <q-select :options='basetypes.EventTypes' :disable='updating' v-model='myTarget.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='myTarget.Sender' :label='$t("MSG_SENDER")' />
        <q-input v-model='myTarget.ReplyTos' :label='$t("MSG_REPLY_TOS_COMMA")' />
        <q-input v-model='myTarget.CCTos' :label='$t("MSG_CC_TOS_COMMA")' />
        <q-input v-model='myTarget.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='myTarget.Body' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <!-- <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' /> -->
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { emailnotiftemplate, notify, basetypes, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

interface MyEmailTemplate {
  ID: number
  EntID: string
  LangID: string
  DefaultToUsername: string
  UsedFor: basetypes.EventType
  Sender: string
  ReplyTos: string
  CCTos: string
  Subject: string
  Body: string
}

const _email = emailnotiftemplate.useEmailTemplateStore()
const templates = computed(() => _email.templates(AppID.value))
const _templates = computed(() => Array.from(templates.value).map((el) => {
  return {
    ID: el.ID,
    LangID: el.LangID,
    DefaultToUsername: el.DefaultToUsername,
    UsedFor: el.UsedFor,
    Sender: el.Sender,
    ReplyTos: el.ReplyTos.join(','),
    CCTos: el.CCTos.join(','),
    Subject: el.Subject,
    Body: el.Body
  } as MyEmailTemplate
}))
const emailLoading = ref(false)

const prepare = () => {
  if (!templates.value.length) {
    getAppEmailTemplates(0, 100)
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

const myTarget = ref({} as MyEmailTemplate)
const target = computed(() => {
  return {
    ID: myTarget.value.ID,
    EntID: myTarget.value?.EntID,
    LangID: myTarget.value.LangID,
    DefaultToUsername: myTarget.value.DefaultToUsername,
    UsedFor: myTarget.value.UsedFor,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value?.ReplyTos?.length === 0 ? [] : myTarget.value?.ReplyTos?.split(','),
    CCTos: myTarget.value?.CCTos?.length === 0 ? [] : myTarget.value?.CCTos?.split(','),
    Subject: myTarget.value.Subject,
    Body: myTarget.value.Body
  } as emailnotiftemplate.Template
})

const onMenuHide = () => {
  showing.value = false
  myTarget.value = {} as MyEmailTemplate
}

const onRowClick = (template: MyEmailTemplate) => {
  myTarget.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppEmailTemplate(done) : createAppEmailTemplate(done)
}

const onCancel = () => {
  onMenuHide()
}

const getAppEmailTemplates = (offset: number, limit: number) => {
  _email.getAppEmailTemplates({
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
  }, (error: boolean, rows?: Array<emailnotiftemplate.Template>) => {
    if (error || !rows?.length) {
      emailLoading.value = false
      return
    }
    getAppEmailTemplates(offset + limit, limit)
  })
}

const validateTarget = () => {
  let valid = true
  target.value?.ReplyTos?.forEach((el) => {
    const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
    emails?.forEach((al) => {
      if (!utils.validateEmailAddress(al)) {
        valid = false
      }
    })
  })
  target.value?.CCTos?.forEach((el) => {
    const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
    emails?.forEach((al) => {
      if (!utils.validateEmailAddress(al)) {
        valid = false
      }
    })
  })
  return valid
}

const createAppEmailTemplate = (done: () => void) => {
  if (!validateTarget()) {
    done()
    return
  }
  _email.createAppEmailTemplate({
    TargetAppID: AppID.value,
    TargetLangID: myTarget.value.LangID,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EMAIL_TEMPLATE',
        Message: 'MSG_CREATE_EMAIL_TEMPLATE_FAIL',
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
const updateAppEmailTemplate = (done: () => void) => {
  if (!validateTarget()) {
    done()
    return
  }
  _email.updateAppEmailTemplate({
    TargetAppID: AppID.value,
    TargetLangID: myTarget.value.LangID,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_EMAIL_TEMPLATE',
        Message: 'MSG_UPDATE_EMAIL_TEMPLATE_FAIL',
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
    field: (row: emailnotiftemplate.Template) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.LangID
  },
  {
    name: 'Sender',
    label: t('MSG_SENDER'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.Sender
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.UsedFor
  },
  {
    name: 'ReplyTos',
    label: t('MSG_REPLY_TOS'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.ReplyTos?.join(',')
  },
  {
    name: 'CCTos',
    label: t('MSG_CC_TOS'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => row.CCTos?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: emailnotiftemplate.Template) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
