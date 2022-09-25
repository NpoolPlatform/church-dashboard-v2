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
        <div class='dark-bg'>
          <LangSwitcher v-model:language='language' :emit-result='true' :set-lang='false' />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.DefaultToUsername' :label='$t("MSG_DEFAULT_TO_USERNAME")' />
        <q-select :options='UsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
        <q-input v-model='replyTos' :label='$t("MSG_REPLY_TOS_COMMA")' />
        <q-input v-model='ccTos' :label='$t("MSG_CC_TOS_COMMA")' />
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Body' :label='$t("MSG_BODY")' type='textarea' />
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
import { useChurchEmailTemplateStore, EmailTemplate, UsedFors, NotifyType } from 'npool-cli-v4'
import { Language } from 'npool-cli-v2'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyEmailTemplate {
  ID: string
  LangID: string
  DefaultToUsername: string
  UsedFor: string
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
const emailLoading = ref(true)

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

const target = ref({} as unknown as EmailTemplate)
const myTarget = ref({} as unknown as MyEmailTemplate)
watch(myTarget, () => {
  target.value = {
    ID: myTarget.value.ID,
    LangID: myTarget.value.LangID,
    DefaultToUsername: myTarget.value.DefaultToUsername,
    UsedFor: myTarget.value.UsedFor,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value.ReplyTos.split(','),
    CCTos: myTarget.value.CCTos.split(','),
    Subject: myTarget.value.Subject,
    Body: myTarget.value.Body
  } as EmailTemplate
})

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

const language = ref(undefined as unknown as Language)
watch(language, () => {
  target.value.LangID = language.value?.ID
})

const onMenuHide = () => {
  language.value = undefined as unknown as Language
  target.value = {} as unknown as EmailTemplate
}

const onRowClick = (template: MyEmailTemplate) => {
  myTarget.value = template
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = (done: () => void) => {
  target.value.LangID = language.value.ID
  updating.value ? updateAppEmailTemplate(done) : createAppEmailTemplate(done)
}

const onCancel = () => {
  showing.value = false
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

const updateAppEmailTemplate = (done: () => void) => {
  templates.updateAppEmailTemplate({
    TargetAppID: appID.value,
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

const createAppEmailTemplate = (done: () => void) => {
  templates.createAppEmailTemplate({
    TargetAppID: appID.value,
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
</script>
