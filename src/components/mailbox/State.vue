<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_SENDSTATES")'
    :rows='displayStates'
    row-key='ID'
    ::rows-per-page-options='[100]'
    :columns='columns'
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
    ::rows-per-page-options='[100]'
    :columns='readStatesColumns'
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
import { formatTime, NotifyType, useChurchSendStateStore, SendState, NotifChannel, useChurchReadStateStore, ReadState } from 'npool-cli-v4'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
    getAppSendStates(0, 500, NotifChannel.ChannelSMS)
    getAppSendStates(0, 500, NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 500)
  }
})

onMounted(() => {
  if (sendStates.value?.length === 0) {
    getAppSendStates(0, 500, NotifChannel.ChannelSMS)
    getAppSendStates(0, 500, NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 500)
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

const columns = computed(() => [
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: SendState) => row.AnnouncementID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: SendState) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: SendState) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: SendState) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: SendState) => row.Channel
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: SendState) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: SendState) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: SendState) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: SendState) => formatTime(row.CreatedAt)
  }
])

const readStatesColumns = computed(() => [
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: ReadState) => row.AnnouncementID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: ReadState) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: ReadState) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: ReadState) => row.Content
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: ReadState) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: ReadState) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: ReadState) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: ReadState) => formatTime(row.CreatedAt)
  }
])
</script>
