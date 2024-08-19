<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MESSAGES")'
    :rows='displayAppMsgs'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as g11nbase.Message)'
    v-model:selected='selectedMessages'
    selection='single'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='!selectedMessages.length'
          @click='onDelete'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
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
        <span>{{ updating ? $t('MSG_UPDATE_MESSAGE') : $t('MSG_CREATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <AppLanguagePicker v-model:app-lang-id='target.LangID' label='MSG_SELECT_LANGUAGE' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <span> {{ target?.Lang }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MessageID' :label='$t("MSG_MESSAGE_ID")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model.number='target.GetIndex' :label='$t("MSG_GET_INDEX")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_MESSAGES")'
    row-key='ID'
    :rows-per-page-options='[100]'
    :rows='loadedMessages'
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
          @click='onBatchClick'
        />
      </div>
    </template>
  </q-table>

  <q-dialog
    v-model='batchCreating'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_BATCH_CREATE_MESSAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <AppLanguagePicker v-model:app-lang-id='langID' label='MSG_CURRENT_MESSAGES_LANGUAGE' />
      </q-card-section>
      <q-item class='row'>
        <q-btn :loading='submitting2' :label='$t("MSG_SUBMIT")' @click='onBatchSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onBatchCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { message, utils, _locale, g11nbase, sdk } from 'src/npoolstore'
import saveAs from 'file-saver'

const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))
const AppID = sdk.AppID

const locale = _locale.useLocaleStore()
const _langID = computed(() => locale?.AppLang?.LangID)

const messages = computed(() => {
  return sdk.messages(_langID.value).filter((el) => el.AppID === AppID.value).sort((a, b) => a.MessageID.localeCompare(b.MessageID, 'zh-CN'))
})

const messageID = ref('')
const displayAppMsgs = computed(() => messages.value.filter((msg) => {
  return msg.MessageID?.toLowerCase().includes(messageID.value?.toLowerCase()) ||
        msg.Message?.toLowerCase()?.includes(messageID.value?.toLowerCase())
}))

const target = ref({} as g11nbase.Message)
const showing = ref(false)
const updating = ref(false)

const submitting = ref(false)
const submitting2 = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value.GetIndex = 0
}

const onMenuHide = () => {
  target.value = {} as g11nbase.Message
  showing.value = false
}

const onRowClick = (row: g11nbase.Message) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onExport = () => {
  const resultMap = new Map<string, Array<g11nbase.Message>>()
  messages.value.forEach((el) => {
    let data = resultMap.get(el.LangID)
    if (!data) {
      data = []
    }
    data.push(el)
    resultMap.set(el.LangID, data)
  })
  resultMap.forEach((values, _key) => {
    if (values.length > 0) {
      console.log('_key: ', _key)
      const blob = new Blob([JSON.stringify(values)], { type: 'text/plain;charset=utf-8' })
      const filename = 'messages-' + values[0].Lang + '-' + utils.formatTime(new Date().getTime() / 1000) + '.json'
      saveAs(blob, filename)
    }
  })
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppMessage() : createAppMessage()
}

const createAppMessage = () => {
  sdk.adminCreateMessage(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateAppMessage = () => {
  sdk.adminUpdateMessage(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onDelete = () => {
  target.value = selectedMessages.value?.[0]
  sdk.adminDeleteMessage(target.value)
}

const loadedMessages = ref([] as Array<g11nbase.Message>)
const selectedMessages = ref([] as Array<g11nbase.Message>)
const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedMessages.value = JSON.parse(reader.result as string) as Array<g11nbase.Message>
    }
    reader.readAsText(filename)
  }
}

const importMessages = computed(() => {
  return Array.from(loadedMessages.value).map((el) => {
    return {
      AppID: AppID.value,
      MessageID: el.MessageID,
      Message: el.Message,
      GetIndex: el.GetIndex,
      Disabled: el.Disabled
    } as message.MessageReq
  })
})

const langID = ref(_langID.value)

const batchCreating = ref(false)

const onBatchClick = () => {
  batchCreating.value = true
}

const onBatchCancel = () => {
  batchCreating.value = false
}

const onBatchSubmit = () => {
  sdk.adminCreateMessages(langID.value, importMessages.value, () => {
    submitting2.value = false
  })
}

const prepare = () => {
  if (!messages.value?.length) {
    sdk.adminGetMessages(0, 0)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
