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
    :columns='apiColumns'
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
    <template #body='props'>
      <q-tr :props='props'>
        <q-td key='ID' :props='props' :auto-width='false'>
          {{ props.row.ID }}
        </q-td>
        <q-td key='Method' :props='props'>
          {{ props.row.Method }}
        </q-td>
        <q-td key='MethodName' :props='props'>
          {{ props.row.MethodName }}
        </q-td>
        <q-td key='Domains' :props='props'>
          {{ props.row.Domains?.join(',') }}
        </q-td>
        <q-td key='PathPrefix' :props='props'>
          {{ props.row.PathPrefix }}
        </q-td>
        <q-td key='Path' :props='props'>
          {{ props.row.Path }}
        </q-td>
        <q-td key='Protocol' :props='props'>
          {{ props.row.Protocol }}
        </q-td>
        <q-td key='ServiceName' :props='props'>
          {{ props.row.ServiceName }}
        </q-td>
        <q-td key='Exported' :props='props'>
          {{ props.row.Exported }}
        </q-td>
        <q-td key='Depracated' :props='props'>
          <q-toggle dense v-model='props.row.Depracated' @update:model-value='onDeprecatedClick(props.row)' />
        </q-td>
        <q-td key='CreatedAt' :props='props'>
          {{ formatTime(props.row.CreatedAt) }}
        </q-td>
        <q-td key='UpdatedAt' :props='props'>
          {{ formatTime(props.row.UpdatedAt) }}
        </q-td>
      </q-tr>
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
import { getAPIs, updateAPI } from 'src/api/apis'
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchAPIStore } from 'src/teststore/apis'
import { API } from 'src/teststore/apis/types'
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
      },
      Info: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Success
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
      },
      Info: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Success
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
  if (apis.value.length === 0) {
    getAPIs(0, 500)
  }

  prepare()
})

const onDeprecatedClick = (row: API) => {
  updateAPI({ ...row }, (error: boolean) => {
    if (error) {
      console.log('error: ', error)
      row.Depracated = !row.Depracated
    }
  })
}

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
    field: (row: User) => row.Roles.join(',')
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
    field: 'ID'
  },
  {
    name: 'Method',
    label: 'MSG_METHOD',
    field: 'Method'
  },
  {
    name: 'MethodName',
    label: 'MSG_METHOD_NAME',
    field: 'MethodName'
  },
  {
    name: 'Domains',
    label: 'MSG_DOMAINS',
    field: 'Domains'
  },
  {
    name: 'PathPrefix',
    label: 'MSG_PATH_PREFIX',
    field: 'PathPrefix'
  },
  {
    name: 'Path',
    label: 'MSG_PATH',
    field: 'Path'
  },
  {
    name: 'Protocol',
    label: 'MSG_PROTOCOL',
    field: 'Protocol'
  },
  {
    name: 'ServiceName',
    label: 'MSG_SERVICE_NAME',
    field: 'ServiceName'
  },
  {
    name: 'Exported',
    label: 'MSG_EXPORTED',
    field: 'Exported'
  },
  {
    name: 'Depracated',
    label: 'MSG_DEPRACATED',
    field: 'Depracated'
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    field: 'CreatedAt'
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    field: 'UpdatedAt'
  }
])
</script>
<style lang='sass' scoped>
.q-table__container
  ::v-deep .q-table--col-auto-width
    display: none
</style>
