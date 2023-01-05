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
    :columns='apiColumns'
    @row-click='(evt, row, index) => onRowClick(row as API)'
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
          @click='onCreateAuthClick(selectedApi?.[0])'
          :disable='selectedApi.length === 0 || selectedRole.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Depracated' :label='$t("MSG_DEPRECATED")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    :title='$t("MSG_APIS")'
    dense
    :rows='displayOldApis'
    row-key='ID'
    :rows-per-page-options='[20]'
    v-model:selected='selectedOldApis'
    selection='single'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedOldApis.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_API') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='oldApiPath'
          :label='$t("MSG_PATH")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onCreateAuthClick(selectedOldApis?.[0])'
          :disable='selectedOldApis.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
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
  ExpandAPI, NotificationType, useAPIStore
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
import { getAPIs } from 'src/api/apis'
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchAPIStore } from 'src/teststore/apis'
import { API } from 'src/teststore/apis/types'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

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

const api = useChurchAPIStore()
const apis = computed(() => api.APIs.APIs)
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

const oldApi = useAPIStore()
const oldApis = computed(() => oldApi.APIs)
const selectedOldApis = ref([] as Array<ExpandAPI>)
const oldApiPath = ref('')
const displayOldApis = computed(() => oldApis.value.filter((api) => api.Path.includes(oldApiPath.value)))

onMounted(() => {
  if (apis.value.length === 0) {
    getAPIs(0, 500)
  }
  oldApi.getAPIs({
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

const target = ref({} as API)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: API) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onMenuHide = () => {
  target.value = {} as API
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  api.updateAPI({
    ID: target.value.ID,
    Depracated: target.value.Depracated,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_API',
        Message: 'MSG_UPDATE_API_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_API',
        Message: 'MSG_UPDATE_API_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

const onCreateAuthClick = (row: ExpandAPI) => {
  if (selectedRole.value.length === 0) {
    return
  }

  auth.createAppAuth({
    TargetAppID: appID.value,
    RoleID: selectedRole.value[0].ID,
    Resource: row.Path,
    Method: row.Method,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_AUTH',
        Message: 'MSG_CREATE_APP_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_AUTH',
        Message: 'MSG_CREATE_APP_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Success
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
        Title: 'MSG_DELETE_APP_AUTH',
        Message: 'MSG_DELETE_APP_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_AUTH',
        Message: 'MSG_DELETE_APP_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Success
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
    field: (row: User) => row.Roles?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const apiColumns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    field: (row: API) => row.ID
  },
  {
    name: 'Method',
    label: 'MSG_METHOD',
    field: (row: API) => row.Method
  },
  {
    name: 'MethodName',
    label: 'MSG_METHOD_NAME',
    field: (row: API) => row.MethodName
  },
  {
    name: 'Domains',
    label: 'MSG_DOMAINS',
    field: (row: API) => row.Domains?.join(',')
  },
  {
    name: 'PathPrefix',
    label: 'MSG_PATH_PREFIX',
    field: (row: API) => row.PathPrefix
  },
  {
    name: 'Path',
    label: 'MSG_PATH',
    field: (row: API) => row.Path
  },
  {
    name: 'Protocol',
    label: 'MSG_PROTOCOL',
    field: (row: API) => row.Protocol
  },
  {
    name: 'ServiceName',
    label: 'MSG_SERVICE_NAME',
    field: (row: API) => row.ServiceName
  },
  {
    name: 'Exported',
    label: 'MSG_EXPORTED',
    field: (row: API) => row.Exported
  },
  {
    name: 'Depracated',
    label: 'MSG_DEPRACATED',
    field: (row: API) => row.Depracated
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    field: (row: API) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    field: (row: API) => formatTime(row.UpdatedAt)
  }
])
</script>
