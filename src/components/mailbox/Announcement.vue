<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENTS")'
    :rows='announcements'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
  />
  <AnnouncementUser />
  <State />
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useChurchAnnouncementStore, Announcement } from 'npool-cli-v4'
import { AppID } from 'src/api/app'
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AnnouncementUser = defineAsyncComponent(() => import('src/components/mailbox/AnnouncementUser.vue'))
const State = defineAsyncComponent(() => import('src/components/mailbox/State.vue'))

const announcement = useChurchAnnouncementStore()
const announcements = computed(() => announcement.announcements(AppID.value))

watch(AppID, () => {
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
    TargetAppID: AppID.value,
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
    sortable: true,
    field: (row: Announcement) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: Announcement) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: Announcement) => row.LangID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: Announcement) => row.Title
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: Announcement) => row.AnnouncementType
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: Announcement) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: Announcement) => row.Channel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: Announcement) => formatTime(row.CreatedAt)
  },
  {
    name: 'END_AT',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: Announcement) => formatTime(row.EndAt)
  }
])
</script>
