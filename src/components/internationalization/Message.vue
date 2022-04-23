<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :loading='langLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedLang'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='displayAppMsgs'
    :loading='messageLoading'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Message)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!language' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_LANGUAGE') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='appMsgId'
          :label='$t("MSG_MESSAGE_ID")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
          :disable='!language'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
          :disable='!language'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_MESSAGES")'
    :rows='loadedMessages'
    row-key='MessageID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_LOAD_FILE")'
          @click='onLoadFile'
        />
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='onFileLoaded'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SUBMIT")'
          @click='onBatchSubmit'
        />
        <div>{{ loadedFile }}</div>
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ $t('MSG_LANGUAGE') }}: {{ language.Name }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MessageID' :label='$t("MSG_MESSAGE_ID")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  formatTime,
  Language,
  Message,
  NotificationType,
  useAdminLangStore,
  useApplicationsStore,
  useChurchLangStore,
  useLocaleStore
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useLocalApplicationStore } from 'src/localstore'
import { saveAs } from 'file-saver'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const application = useApplicationsStore()
const clang = useChurchLangStore()
const alang = useAdminLangStore()
const locale = useLocaleStore()

const langLoading = ref(true)
const messageLoading = ref(false)

const langs = computed(() => alang.Languages)

const selectedLang = ref([] as Array<Language>)
const language = computed(() => selectedLang.value.length > 0 ? selectedLang.value[0] : undefined as unknown as Language)
const messages = computed(() => {
  return clang.Messages.get(appID.value)?.get(language.value?.ID) ? clang.Messages.get(appID.value)?.get(language?.value.ID) : []
})
const appMsgId = ref('')
const displayAppMsgs = computed(() => messages.value ? messages.value.filter((msg) => msg.MessageID.includes(appMsgId.value)) : [])

const prepare = () => {
  alang.getLangs({
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    langLoading.value = false
    getMessages()
  })
}

const getMessages = () => {
  if (!language.value) {
    return
  }

  messageLoading.value = true

  clang.getMessages({
    TargetAppID: appID.value,
    TargetLangID: language.value.ID,
    LangID: language.value.ID,
    Message: {
      Error: {
        Title: 'MSG_GET_MESSAGES',
        Message: 'MSG_GET_MESSAGES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    messageLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Message)

watch(language, () => {
  getMessages()
  target.value.LangID = language.value?.ID
})

onMounted(() => {
  prepare()
})

const onCreate = () => {
  target.value = {} as unknown as Message
  target.value.LangID = language.value?.ID
  showing.value = true
  updating.value = false
}

const onRowClick = (message: Message) => {
  target.value = message
  showing.value = true
  updating.value = true
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    alang.updateMessage({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_MESSAGE',
          Message: 'MSG_UPDATE_MESSAGE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  clang.createMessage({
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

interface SavedMessages {
  Languages: Array<Language>
  Language: Language
  Messages: Array<Message>
}

const onExport = () => {
  if (!language.value) {
    return
  }

  const blob = new Blob([JSON.stringify({
    Languages: locale.Languages,
    Language: language.value,
    Messages: messages.value
  })], { type: 'text/plain;charset=utf-8' })
  const filename = application.getApplicationByID(appID.value)?.App.Name + '-' +
                   language.value.Name + '-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.json'
  saveAs(blob, filename)
}

const loadedFile = ref(undefined as unknown as string)
const loadFileButton = ref<HTMLInputElement>()

const loadedLanguage = ref(undefined as unknown as Language)
const loadedMessages = ref([] as Array<Message>)

const onLoadFile = () => {
  loadFileButton.value?.click()
}

const onFileLoaded = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const loaded = JSON.parse(reader.result as string) as SavedMessages
      const index = locale.Languages.findIndex((el) => el.ID === loaded.Language.ID)
      locale.Languages.splice(index, index < 0 ? 0 : 1, loaded.Language)
      selectedLang.value = [loaded.Language]
      loadedLanguage.value = loaded.Language
      loadedMessages.value = loaded.Messages
    }
    reader.readAsText(filename)
  }
}

const onBatchSubmit = () => {
  clang.createMessages({
    TargetAppID: appID.value,
    TargetLangID: loadedLanguage.value.ID,
    Infos: loadedMessages.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_MESSAGES',
        Message: 'MSG_CREATE_MESSAGES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
