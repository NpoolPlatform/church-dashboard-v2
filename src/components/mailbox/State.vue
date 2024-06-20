<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_SENDSTATES")'
    :rows='displayStates'
    row-key='ID'
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { announcementsendstate, announcementreadstate, notify, utils, notifbase, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const send = announcementsendstate.useSendStateStore()
const sendStates = computed(() => send.states(AppID.value))

const username = ref('')
const displayStates = computed(() => sendStates.value.filter((el) => {
  return el.AnnouncementID?.toLowerCase().includes(username.value?.toLocaleLowerCase()) ||
        el.EmailAddress?.toLowerCase().includes(username.value?.toLocaleLowerCase()) ||
        el.PhoneNO?.toLowerCase().includes(username.value?.toLocaleLowerCase())
}))

const read = announcementreadstate.useReadStateStore()
const readStates = computed(() => read.states(AppID.value))

const username1 = ref('')
const displayReadStates = computed(() => readStates.value.filter((el) => {
  return el.AnnouncementID?.toLowerCase().includes(username1.value?.toLocaleLowerCase()) ||
        el.EmailAddress?.toLowerCase().includes(username1.value?.toLocaleLowerCase()) ||
        el.PhoneNO?.toLowerCase().includes(username1.value?.toLocaleLowerCase())
}))

watch(AppID, () => {
  if (sendStates.value?.length === 0) {
    getAppSendStates(0, 100, notifbase.NotifChannel.ChannelSMS)
    getAppSendStates(0, 100, notifbase.NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 100)
  }
})

onMounted(() => {
  if (sendStates.value?.length === 0) {
    getAppSendStates(0, 100, notifbase.NotifChannel.ChannelSMS)
    getAppSendStates(0, 100, notifbase.NotifChannel.ChannelEmail)
  }

  if (readStates.value?.length === 0) {
    getAppReadStates(0, 100)
  }
})

const getAppSendStates = (offset: number, limit: number, channel: notifbase.NotifChannel) => {
  send.getNAppSendStates({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Channel: channel,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<announcementsendstate.SendState>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppSendStates(offset + limit, limit, channel)
  })
}

const getAppReadStates = (offset: number, limit: number) => {
  read.getNAppReadStates({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<announcementreadstate.ReadState>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppReadStates(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.EntID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.AnnouncementID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.Channel
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: announcementsendstate.SendState) => utils.formatTime(row.CreatedAt)
  }
])

const readStatesColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.EntID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.AnnouncementID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.Content
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: announcementreadstate.ReadState) => utils.formatTime(row.CreatedAt)
  }
])
</script>
