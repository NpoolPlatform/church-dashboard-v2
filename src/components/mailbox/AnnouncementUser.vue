<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_USERS")'
    :rows='displayAnnouncementUsers'
    row-key='ID'
    :columns='columns'
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
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, AnnouncementUser, useChurchAnnouncementUserStore } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const announcementUser = useChurchAnnouncementUserStore()
const announcementUsers = computed(() => announcementUser.getAnnouncementUserByAppID(appID.value))

const username = ref('')
const displayAnnouncementUsers = computed(() => announcementUser.getAnnouncementUsersByID(appID.value, username.value?.toLowerCase()))

watch(appID, () => {
  if (announcementUsers.value?.length === 0) {
    getAppAnnouncementUsers(0, 100)
  }
})

onMounted(() => {
  if (announcementUsers.value?.length === 0) {
    getAppAnnouncementUsers(0, 100)
  }
})

const getAppAnnouncementUsers = (offset: number, limit: number) => {
  announcementUser.getAppAnnouncementUsers({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENT_USERS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_USERS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AnnouncementUser>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppAnnouncementUsers(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: AnnouncementUser) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: AnnouncementUser) => row.AppID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    field: (row: AnnouncementUser) => row.AnnouncementID
  },
  {
    name: 'AnnouncementType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    field: (row: AnnouncementUser) => row.AnnouncementType
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: AnnouncementUser) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: AnnouncementUser) => row.Content
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: AnnouncementUser) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAT',
    label: t('MSG_UPDATED_AT'),
    field: (row: AnnouncementUser) => formatTime(row.UpdatedAt)
  }
])
</script>
