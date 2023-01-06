<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    :loading='userLoading'
    v-model:selected='selectedUser'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreateInvitationCodeClick'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='displayCodes'
    row-key='ID'
    :loading='codeLoading'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='searchStr'
          :label='$t("MSG_SEARCH")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useChurchUserStore, User } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchInvitationCodeStore } from 'src/teststore/invitation/invitationcode'
import { InvitationCode } from 'src/teststore/invitation/invitationcode/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
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

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const invitationCode = useChurchInvitationCodeStore()
const codes = computed(() => invitationCode.InvitationCodes.InvitationCodes)

const codeLoading = ref(false)

interface Code extends InvitationCode {
  EmailAddress: string
  PhoneNO: string
}

const userLoading = ref(false)
const user = useChurchUserStore()
const ecodes = computed(() => Array.from(codes.value).map((code: InvitationCode) => {
  const myCode = code as unknown as Code
  myCode.EmailAddress = user.getUserByAppUserID(appID.value, code.UserID)?.EmailAddress
  myCode.PhoneNO = user.getUserByAppUserID(appID.value, code.UserID)?.PhoneNO
  return myCode
}))

const searchStr = ref('')
const displayCodes = computed(() => ecodes.value.filter((el) => {
  return el.EmailAddress?.includes(searchStr.value) || el.InvitationCode?.includes(searchStr.value) || el.PhoneNO?.includes(searchStr.value)
}))

const appUsers = computed(() => {
  return user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : []
})
const users = computed(() => {
  return appUsers.value.filter((el) => codes.value.findIndex((code) => el.ID === code.UserID) < 0)
})

const selectedUser = ref([] as Array<User>)
const username = ref('')
const displayUsers = computed(() => {
  return users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value))
})

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
const getInvitationCodes = (offset: number, limit: number) => {
  invitationCode.getAppInvitationCodes({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_INVITATION_CODES'),
        Message: t('MSG_GET_INVITATION_CODES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<InvitationCode>) => {
    if (error || rows.length < limit) {
      return
    }
    getInvitationCodes(offset + limit, limit)
  })
}
const prepare = () => {
  if (!user.Users.get(appID.value)) {
    userLoading.value = true
    getAppUsers(0, 500)
  }

  if (codes.value?.length === 0) {
    getInvitationCodes(0, 100)
  }
}

onMounted(() => {
  prepare()
})

watch(appID, () => {
  prepare()
})

const onCreateInvitationCodeClick = () => {
  if (selectedUser.value.length === 0) {
    return
  }
  invitationCode.createInvitationCode({
    // TargetAppID: appID.value,
    TargetUserID: selectedUser.value[0].ID,
    // Info: {
    //   UserID: selectedUser.value[0].ID
    // },
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
