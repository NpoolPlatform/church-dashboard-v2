<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='appUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[20]'
    :columns='columns'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useChurchUserStore, User, formatTime } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const userLoading = ref(false)

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const prepare = () => {
  userLoading.value = true
  getAppUsers(0, 100)
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])
</script>
