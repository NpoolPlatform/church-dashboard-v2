<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='displayAppMsgs'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Message)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='messageID'
          :label='$t("MSG_MESSAGE_ID")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <!-- <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
          :disable='!language'
        /> -->
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
        <span>{{ updating ? $t('MSG_CREATE_MESSAGE') : $t('MSG_UPDATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <AppLanguagePicker v-model:id='targetLangID' label='MSG_SELECT_LANGUAGE' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MessageID' :label='$t("MSG_MESSAGE_ID")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model.number='target.GetIndex' :label='$t("MSG_GET_INDEX")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_MESSAGES")'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='uploadFile'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_IMPORT")'
          @click='loadFileButton?.click()'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_BATCH_CREATE")'
          :disable='loadedMessages.length === 0'
          @click='onBatchCreate'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>

import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useChurchMessageStore } from 'src/teststore/g11n/message'
import { getAppMessages } from 'src/api/g11n'
import { appID } from 'src/api/app'
import { Message, MessageReq } from 'src/teststore/g11n/message/types'
import { NotifyType } from 'npool-cli-v4'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))

const message = useChurchMessageStore()
const messages = computed(() => message.getMessagesByAppID(appID.value).sort((a, b) => a.MessageID.localeCompare(b.MessageID, 'zh-CN')))

const messageID = ref('')
const displayAppMsgs = computed(() => messages.value.filter((msg) => msg.MessageID.includes(messageID.value)))

const targetLangID = ref('')
const target = ref({} as Message)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value.Disabled = false
  target.value.GetIndex = 0
}

const onMenuHide = () => {
  target.value = {} as Message
  showing.value = false
}

const onRowClick = (row: Message) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppMessage(done) : createAppMessage(done)
}

const createAppMessage = (done: () => void) => {
  message.createAppMessage({
    TargetAppID: appID.value,
    TargetLangID: targetLangID.value,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_COUNTRY',
        Message: 'MSG_CREATE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_COUNTRY',
        Message: 'MSG_CREATE_COUNTRY_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateTarget = computed(() => {
  return {
    ID: target?.value?.ID,
    TargetAppID: appID.value,
    TargetLangID: target?.value?.LangID,
    Lang: target?.value?.Lang,
    MessageID: target?.value?.MessageID,
    Message: target?.value?.Message,
    GetIndex: target?.value?.GetIndex,
    Disabled: target?.value?.Disabled
  }
})
const updateAppMessage = (done: () => void) => {
  message.updateAppMessage({
    ...updateTarget.value,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_COUNTRY',
        Message: 'MSG_UPDATE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_COUNTRY',
        Message: 'MSG_UPDATE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const loadedMessages = ref([] as Array<MessageReq>)
const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedMessages.value = JSON.parse(reader.result as string) as Array<MessageReq>
    }
    reader.readAsText(filename)
  }
}

const onBatchCreate = () => {
  message.createAppMessages({
    TargetAppID: appID.value,
    TargetLangID: target.value.Lang,
    Infos: loadedMessages.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRIES',
        Message: 'MSG_CREATE_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_BATCH_CREATE_COUNTRIES',
        Message: 'MSG_BATCH_CREATE_COUNTRIES_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const prepare = () => {
  if (messages.value?.length === 0) {
    getAppMessages(0, 200)
  }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
