<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CHANNELS")'
    :rows='channels'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <!-- <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        /> -->
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { notifchannel, utils, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const channel = notifchannel.useNotifChannelStore()
const channels = computed(() => channel.channels(AppID.value))

watch(AppID, () => {
  if (channels.value?.length === 0) {
    getAppNotifChannels(0, 100)
  }
})

onMounted(() => {
  if (channels.value?.length === 0) {
    getAppNotifChannels(0, 100)
  }
})

const getAppNotifChannels = (offset: number, limit: number) => {
  channel.getNAppNotifChannels({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_CHANNELS'),
        Message: t('MSG_GET_CHANNELS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<notifchannel.TNotifChannel>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppNotifChannels(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.AppID
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.EventType
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.Channel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => utils.formatTime(row.CreatedAt)
  }
])
</script>
