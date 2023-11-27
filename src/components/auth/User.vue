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
    @row-click='(evt, row, index) => onRowClick(row as npoolapi.API)'
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
          <q-toggle dense v-model='target.Deprecated' :label='$t("MSG_DEPRECATED")' />
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
import { getAPIs } from 'src/api/apis'
import { AppID } from 'src/api/app'
import { npoolapi, user, authing, notify, utils } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(AppID.value))
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<user.User>)
const userLoading = ref(false)

const api = npoolapi.useNpoolAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<npoolapi.API>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = authing.useAuthingStore()
const auths = computed(() => auth.auths(AppID.value, selectedUser.value[0]?.EntID))
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))
const selectedAuth = ref([] as Array<authing.Auth>)

const getAppUsers = (offset: number, limit: number) => {
  _user.getAppUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<user.User>) => {
    if (error || !rows?.length) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

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
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<authing.Auth>) => {
    if (error || !rows?.length) {
      return
    }
    getAppAuths(offset + limit, limit)
  })
}

const prepare = () => {
  if (!users.value.length) {
    userLoading.value = true
    getAppUsers(0, 100)
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
    getAPIs(0, 100)
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
    Deprecated: target.value.Deprecated,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_API',
        Message: 'MSG_UPDATE_API_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_API',
        Message: 'MSG_UPDATE_API_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

const onCreateAuthClick = (row: npoolapi.API) => {
  auth.createAppAuth({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value[0]?.EntID,
    Resource: row.Path,
    Method: row.Method,
    Message: {
      Error: {
        Title: 'MSG_CREATE_USER_AUTH',
        Message: 'MSG_CREATE_USER_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_USER_AUTH',
        Message: 'MSG_CREATE_USER_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteAuthClick = () => {
  auth.deleteAppAuth({
    TargetAppID: AppID.value,
    ID: selectedAuth.value[0].ID,
    EntID: selectedAuth.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_USER_AUTH',
        Message: 'MSG_DELETE_APP_USER_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_USER_AUTH',
        Message: 'MSG_DELETE_APP_USER_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
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
    field: (row: user.User) => row.AppID
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: user.User) => row.EntID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: user.User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: user.User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: user.User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: user.User) => utils.formatTime(row.CreatedAt)
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
    name: 'Deprecated',
    label: 'MSG_DEPRECATED',
    sortable: true,
    field: (row: npoolapi.API) => row.Deprecated
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: npoolapi.API) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    sortable: true,
    field: (row: npoolapi.API) => utils.formatTime(row.UpdatedAt)
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
