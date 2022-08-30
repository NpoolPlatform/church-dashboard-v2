<template>
  <q-table
    :title='$t("MSG_ROLES")'
    dense
    :rows='roles'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedRole'
  />
  <q-table
    :title='$t("MSG_ROLE_RESOURCES")'
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
          :disable='selectedApi.length === 0 || selectedRole.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    v-if='false'
    :title='$t("MSG_ROLE_USERS")'
    dense
    :columns='columns'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[5]'
  />
</template>

<script setup lang='ts'>
import {
  useAPIStore,
  NotificationType,
  ExpandAPI
} from 'npool-cli-v2'
import {
  User,
  Role,
  Auth,
  NotifyType,
  useChurchUserStore,
  useChurchAuthingStore,
  useChurchRoleStore,
  InvalidID,
  formatTime
} from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUserStore()
const users = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])

const role = useChurchRoleStore()
const roles = computed(() => role.Roles.get(appID.value) ? role.Roles.get(appID.value) as Array<Role> : [])

const auth = useChurchAuthingStore()
const auths = computed(() => auth.Auths.get(appID.value) ? auth.Auths.get(appID.value) as Array<Auth> : [])

const selectedRole = ref([] as Array<Role>)

const displayUsers = computed(() => users.value.filter((user) => {
  if (selectedRole.value.length === 0) {
    return true
  }
  const index = user.Roles?.findIndex((role) => role === selectedRole.value[0].Role)
  return index >= 0
}))

const api = useAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => {
  return auth.UserID === InvalidID &&
          auth.RoleID !== InvalidID &&
          auth.Resource.includes(authPath.value) &&
          (selectedRole.value.length === 0 || auth.RoleID === selectedRole.value[0]?.ID)
}))
const selectedAuth = ref([] as Array<Auth>)

const getAppAuths = (offset: number, limit: number) => {
  auth.getAppAuths({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
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

const getAppRoles = (offset: number, limit: number) => {
  role.getAppRoles({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<Role>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppRoles(offset + limit, limit)
  })
}

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const prepare = () => {
  if (!auths.value?.length) {
    getAppAuths(0, 100)
  }
  if (!roles.value?.length) {
    getAppRoles(0, 100)
  }
  if (!users.value?.length) {
    getAppUsers(0, 100)
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
  if (selectedApi.value.length === 0) {
    return
  }

  if (selectedRole.value.length === 0) {
    return
  }

  auth.createAppAuth({
    TargetAppID: appID.value,
    RoleID: selectedRole.value[0].ID,
    Resource: selectedApi.value[0].Path,
    Method: selectedApi.value[0].Method,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_AUTH',
        Message: 'MSG_CREATE_APP_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteAuthClick = () => {
  if (selectedAuth.value.length === 0) {
    return
  }

  auth.deleteAppAuth({
    TargetAppID: appID.value,
    ID: selectedAuth.value[0].ID,
    Message: {
      Error: {
        Title: 'MSG_DELETEAPP_AUTH',
        Message: 'MSG_DELETE_APP_AUTH_FAIL',
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
