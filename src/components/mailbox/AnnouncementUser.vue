<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_USERS")'
    :rows='displayAnnouncementUsers'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
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
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { announcementuser, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const announcementUser = announcementuser.useAnnouncementUserStore()
const announcementUsers = computed(() => announcementUser.users(AppID.value))

const username = ref('')
const displayAnnouncementUsers = computed(() => announcementUsers.value.filter((el) => {
  return el.AnnouncementID?.toLowerCase().includes(username.value?.toLowerCase()) ||
        el.EmailAddress?.toLowerCase().includes(username.value?.toLowerCase()) ||
        el.PhoneNO?.toLowerCase().includes(username.value?.toLowerCase())
}))

watch(AppID, () => {
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
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENT_USERS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_USERS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<announcementuser.User>) => {
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
    sortable: true,
    field: (row: announcementuser.User) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.AppID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.AnnouncementID
  },
  {
    name: 'AnnouncementType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    sortable: true,
    field: (row: announcementuser.User) => row.AnnouncementType
  },
  {
    name: 'UserID',
    label: t('USER_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('EMAIL_ADDRESS'),
    sortable: true,
    field: (row: announcementuser.User) => row.EmailAddress
  },
  {
    name: 'Username',
    label: t('USERNAME'),
    sortable: true,
    field: (row: announcementuser.User) => row.Username
  },
  {
    name: 'PhoneNO',
    label: t('PHONE_NO'),
    sortable: true,
    field: (row: announcementuser.User) => row.PhoneNO
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: announcementuser.User) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: announcementuser.User) => row.Content
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: announcementuser.User) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAT',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: announcementuser.User) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
