<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    row-key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[20]'
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
        <q-select :options='UsedFors' :disable='updating' v-model='myTarget.UsedFor' :label='$t("MSG_USED_FOR")' />
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
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useChurchEmailTemplateStore, EmailTemplate, UsedFors, NotifyType, UsedFor, validateEmailAddress } from 'npool-cli-v4'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyEmailTemplate {
  ID: string
  LangID: string
  DefaultToUsername: string
  UsedFor: UsedFor
  Sender: string
  ReplyTos: string
  CCTos: string
  Subject: string
  Body: string
}

const templates = useChurchEmailTemplateStore()
const appEmails = computed(() => {
  return templates.EmailTemplates.EmailTemplates.get(appID.value) ? templates.EmailTemplates.EmailTemplates.get(appID.value) as Array<EmailTemplate> : []
})
const emails = computed(() => Array.from(appEmails.value).map((el) => {
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
  if (!templates.EmailTemplates.EmailTemplates.get(appID.value)) {
    getAppEmailTemplates(0, 500)
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

const myTarget = ref({} as MyEmailTemplate)
const target = computed(() => {
  return {
    ID: myTarget.value.ID,
    LangID: myTarget.value.LangID,
    DefaultToUsername: myTarget.value.DefaultToUsername,
    UsedFor: myTarget.value.UsedFor,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value?.ReplyTos?.length === 0 ? [] : myTarget.value?.ReplyTos?.split(','),
    CCTos: myTarget.value?.CCTos?.length === 0 ? [] : myTarget.value?.CCTos?.split(','),
    Subject: myTarget.value.Subject,
    Body: myTarget.value.Body
  } as EmailTemplate
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
  templates.getAppEmailTemplates({
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
  }, (emailTemplates: Array<EmailTemplate>, error: boolean) => {
    if (error || emailTemplates.length < limit) {
      emailLoading.value = false
      return
    }
    getAppEmailTemplates(offset + limit, limit)
  })
}

const createAppEmailTemplate = (done: () => void) => {
  let flag = false
  if (myTarget.value?.ReplyTos?.length > 0) {
    myTarget.value?.ReplyTos?.split(',')?.forEach((el) => {
      if (!validateEmailAddress(el)) {
        console.log('invalid email address', el)
        flag = true
      }
    })
  }
  if (myTarget.value?.CCTos?.length > 0) {
    myTarget.value?.CCTos?.split(',')?.forEach((el) => {
      if (!validateEmailAddress(el)) {
        console.log('invalid email address', el)
        flag = true
      }
    })
  }
  if (flag) {
    done()
    return
  }
  templates.createAppEmailTemplate({
    TargetAppID: appID.value,
    TargetLangID: myTarget.value.LangID,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EMAIL_TEMPLATE',
        Message: 'MSG_CREATE_EMAIL_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: EmailTemplate, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
const updateAppEmailTemplate = (done: () => void) => {
  let flag = false
  if (myTarget.value?.ReplyTos?.length > 0) {
    myTarget.value?.ReplyTos?.split(',')?.forEach((el) => {
      if (!validateEmailAddress(el)) {
        console.log('invalid email address', el)
        flag = true
      }
    })
  }
  if (myTarget.value?.CCTos?.length > 0) {
    myTarget.value?.CCTos?.split(',')?.forEach((el) => {
      if (!validateEmailAddress(el)) {
        console.log('invalid email address', el)
        flag = true
      }
    })
  }
  if (flag) {
    done()
    return
  }
  templates.updateAppEmailTemplate({
    TargetAppID: appID.value,
    TargetLangID: myTarget.value.LangID,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_EMAIL_TEMPLATE',
        Message: 'MSG_UPDATE_EMAIL_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (template: EmailTemplate, error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
</script>
