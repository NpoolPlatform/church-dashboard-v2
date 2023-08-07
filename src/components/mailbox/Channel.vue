<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CHANNELS")'
    :rows='channels'
    row-key='ID'
    :columns='columns'
    ::rows-per-page-options='[100]'
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
import { formatTime, NotifyType, useChurchNotifChannelStore, TNotifChannel as NotifChannel } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const channel = useChurchNotifChannelStore()
const channels = computed(() => channel.getNotifChannelByAppID(appID.value))

watch(appID, () => {
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
  channel.getAppNotifChannels({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_CHANNELS'),
        Message: t('MSG_GET_CHANNELS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<NotifChannel>) => {
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
    field: (row: NotifChannel) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: NotifChannel) => row.AppID
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    field: (row: NotifChannel) => row.EventType
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    field: (row: NotifChannel) => row.Channel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: NotifChannel) => formatTime(row.CreatedAt)
  }
])
</script>
