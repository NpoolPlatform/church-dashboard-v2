<template>
  <q-table
    :title='$t("MSG_USERS")'
    dense
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
          :disable='selectedApi.length === 0 || selectedUser.length === 0'
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
</template>

<script setup lang='ts'>
import { ExpandAPI, Auth } from 'npool-cli-v2'
import { formatTime, NotifyType, useChurchAuthingStore, User, useChurchUserStore } from 'npool-cli-v4'
import { getAPIs } from 'src/api/apis'
import { AppID } from 'src/api/app'
import { npoolapi } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const user = useChurchUserStore()
const users = computed(() => user.Users.get(AppID.value) ? user.Users.get(AppID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<User>)
const userLoading = ref(false)

const api = npoolapi.useNpoolAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auths = computed(() => {
  return auth.Auths.get(AppID.value) ? auth.Auths.get(AppID.value)?.filter((al) => {
    return al.UserID === selectedUser.value[0]?.ID
  }) : []
})
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))
const selectedAuth = ref([] as Array<Auth>)

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: AppID.value,
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
const auth = useChurchAuthingStore()
const getAppAuths = (offset: number, limit: number) => {
  auth.getAppAuths({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
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
  if (!user.Users.get(AppID.value)) {
    userLoading.value = true
    getAppUsers(0, 500)
  }

  if (!auth.Auths.get(AppID.value)) {
    getAppAuths(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (apis.value.length === 0) {
    getAPIs(0, 500)
  }

  prepare()
})

const target = ref({} as npoolapi.API)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: npoolapi.API) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onMenuHide = () => {
  target.value = {} as npoolapi.API
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
  auth.createAppAuth({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value[0]?.ID,
    Resource: row.Path,
    Method: row.Method,
    Message: {
      Error: {
        Title: 'MSG_CREATE_USER_AUTH',
        Message: 'MSG_CREATE_USER_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_USER_AUTH',
        Message: 'MSG_CREATE_USER_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteAuthClick = () => {
  auth.deleteAppAuth({
    TargetAppID: AppID.value,
    ID: selectedAuth.value[0].ID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_USER_AUTH',
        Message: 'MSG_DELETE_APP_USER_AUTH_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_USER_AUTH',
        Message: 'MSG_DELETE_APP_USER_AUTH_FAIL',
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
    sortable: true,
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const apiColumns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: npoolapi.API) => row.ID
  },
  {
    name: 'Method',
    label: 'MSG_METHOD',
    sortable: true,
    field: (row: npoolapi.API) => row.Method
  },
  {
    name: 'PathPrefix',
    label: 'MSG_PATH_PREFIX',
    sortable: true,
    field: (row: npoolapi.API) => row.PathPrefix
  },
  {
    name: 'Path',
    label: 'MSG_PATH',
    sortable: true,
    field: (row: npoolapi.API) => row.Path
  },
  {
    name: 'ServiceName',
    label: 'MSG_SERVICE_NAME',
    sortable: true,
    field: (row: npoolapi.API) => row.ServiceName
  },
  {
    name: 'Exported',
    label: 'MSG_EXPORTED',
    sortable: true,
    field: (row: npoolapi.API) => row.Exported
  },
  {
    name: 'Depracated',
    label: 'MSG_DEPRACATED',
    sortable: true,
    field: (row: npoolapi.API) => row.Depracated
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: npoolapi.API) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    sortable: true,
    field: (row: npoolapi.API) => formatTime(row.UpdatedAt)
  },
  {
    name: 'MethodName',
    label: 'MSG_METHOD_NAME',
    sortable: true,
    field: (row: npoolapi.API) => row.MethodName
  },
  {
    name: 'Domains',
    label: 'MSG_DOMAINS',
    sortable: true,
    field: (row: npoolapi.API) => row.Domains?.join(',')
  },
  {
    name: 'Protocol',
    label: 'MSG_PROTOCOL',
    sortable: true,
    field: (row: npoolapi.API) => row.Protocol
  }
])
</script>
