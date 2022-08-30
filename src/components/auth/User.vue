<template>
  <q-table
    :title='$t("MSG_USERS")'
    dense
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedUser'
    :loading='userLoading'
    :columns='columns'
  />
  <q-table
    :title='$t("MSG_USER_RESOURCES")'
    dense
    :rows='displayAuths'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedAuth'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedApi.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_AUTH') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='authPath'
          :label='$t("MSG_PATH")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_UNAUTHORIZE")'
          @click='onDeleteAuthClick'
          :disable='selectedAuth.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    :title='$t("MSG_APIS")'
    dense
    :rows='displayApis'
    row-key='ID'
    :rows-per-page-options='[20]'
    selection='single'
    v-model:selected='selectedApi'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!selectedApi' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_API') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='apiPath'
          :label='$t("MSG_PATH")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onCreateAuthClick'
          :disable='selectedApi.length === 0 || selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { useAPIStore, NotificationType, ExpandAPI, Auth } from 'npool-cli-v2'
import { formatTime, NotifyType, useChurchAuthingStore, User, useChurchUserStore } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUserStore()
const users = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<User>)
const userLoading = ref(false)

const api = useAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auths = computed(() => {
  return newAuth.Auths.get(appID.value) ? newAuth.Auths.get(appID.value)?.filter((al) => {
    return al.UserID === selectedUser.value[0]?.ID
  }) : []
})
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))
const selectedAuth = ref([] as Array<Auth>)

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
const newAuth = useChurchAuthingStore()
const getAppAuths = (offset: number, limit: number) => {
  newAuth.getAppAuths({
    Offset: offset,
    Limit: limit,
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<Auth>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppAuths(offset + limit, limit)
  })
}

const prepare = () => {
  if (!user.Users.get(appID.value)) {
    userLoading.value = true
    getAppUsers(0, 500)
  }

  if (!newAuth.Auths.get(appID.value)) {
    getAppAuths(0, 100)
  }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  api.getAPIs({
    Message: {
      Error: {
        Title: 'MSG_GET_API',
        Message: 'MSG_GET_APIS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  prepare()
})

const onCreateAuthClick = () => {
  newAuth.createAppAuth({
    TargetAppID: appID.value,
    // TargetUserID: selectedUser.value[0]?.ID,
    Resource: selectedApi.value[0].Path,
    Method: selectedApi.value[0].Method,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteAuthClick = () => {
  newAuth.deleteAppAuth({
    TargetAppID: appID.value,
    ID: selectedAuth.value[0].ID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_USER_AUTH',
        Message: 'MSG_DELETE_APP_USER_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
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
