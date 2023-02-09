<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENTS")'
    :rows='announcements'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[10]'
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
import { formatTime, NotifyType } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { useChurchAnnouncementStore } from 'src/teststore/notif/announcement'
import { Announcement } from 'src/teststore/notif/announcement/types'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const announcement = useChurchAnnouncementStore()
const announcements = computed(() => announcement.getAnnouncementByAppID(appID.value))

watch(appID, () => {
  if (announcements.value?.length === 0) {
    getAppAnnouncements(0, 100)
  }
})

onMounted(() => {
  if (announcements.value?.length === 0) {
    getAppAnnouncements(0, 100)
  }
})

const getAppAnnouncements = (offset: number, limit: number) => {
  announcement.getAppAnnouncements({
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
  }, (error: boolean, rows: Array<Announcement>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppAnnouncements(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Announcement) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: Announcement) => row.AppID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: Announcement) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: Announcement) => row.Content
  },
  {
    name: 'Channels',
    label: t('MSG_CHANNELS'),
    field: (row: Announcement) => row.Channels?.join(',')
  },
  {
    name: 'SendChannel',
    label: t('MSG_CHANNELS'),
    field: (row: Announcement) => row.SendChannel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: Announcement) => formatTime(row.CreatedAt)
  },
  {
    name: 'END_AT',
    label: t('MSG_END_AT'),
    field: (row: Announcement) => formatTime(row.EndAt)
  }
])
</script>
