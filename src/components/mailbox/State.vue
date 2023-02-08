<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_SENDSTATES")'
    :rows='displayStates'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_READSTATES")'
    :rows='displayReadStates'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username1'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useChurchSendStateStore } from 'src/teststore/notif/sendstate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SendState } from 'src/teststore/notif/sendstate/types'
import { NotifChannel } from 'src/teststore/notif/announcement/types'
import { useChurchReadStateStore } from 'src/teststore/notif/readstate'
import { ReadState } from 'src/teststore/notif/readstate/types'
import { appID } from 'src/api/app'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const send = useChurchSendStateStore()
const sendStates = computed(() => send.getStatesByAppID(appID.value))

const username = ref('')
const displayStates = computed(() => send.getStatesByID(appID.value, username.value?.toLocaleLowerCase()))

const read = useChurchReadStateStore()
const readStates = computed(() => read.getStatesByAppID(appID.value))

const username1 = ref('')
const displayReadStates = computed(() => read.getStatesByID(appID.value, username1.value?.toLocaleLowerCase()))

watch(appID, () => {
  if (sendStates.value?.length === 0) {
    getAppSendStates(0, 100, NotifChannel.ChannelSMS)
    getAppSendStates(0, 100, NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 100)
  }
})

onMounted(() => {
  if (sendStates.value?.length === 0) {
    getAppSendStates(0, 100, NotifChannel.ChannelSMS)
    getAppSendStates(0, 100, NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 100)
  }
})

const getAppSendStates = (offset: number, limit: number, channel: NotifChannel) => {
  send.getAppSendStates({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Channel: channel,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<SendState>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppSendStates(offset + limit, limit, channel)
  })
}

const getAppReadStates = (offset: number, limit: number) => {
  read.getAppReadStates({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ReadState>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppReadStates(offset + limit, limit)
  })
}
</script>
