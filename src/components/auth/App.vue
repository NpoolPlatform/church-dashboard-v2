<template>
  <q-table
    :title='$t("MSG_APP_RESOURCES")'
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
    v-model:selected='selectedApi'
    :columns='columns'
    selection='single'
    @row-click='(evt, row, index) => onRowClick(row as npoolapi.API)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedApi.length === 0' class='column justify-center'>
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
          :disable='selectedApi.length === 0'
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
import { npoolapi, authing, notify, utils, sdk } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const AppID = sdk.AppID
const apis = sdk.apis

const selectedApi = ref([] as Array<npoolapi.API>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = authing.useAuthingStore()
const auths = computed(() => auth.auths(AppID.value))
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))
const selectedAuth = ref([] as Array<authing.Auth>)

const getAppAuths = (offset: number, limit: number) => {
  auth.getAppAuths({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
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
  if (!auths.value?.length) {
    getAppAuths(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (apis.value.length === 0) {
    sdk.getApis(0, 0)
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
  sdk.updateApi(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const onCreateAuthClick = (row: npoolapi.API) => {
  auth.createAppAuth({
    TargetAppID: AppID.value,
    Resource: row.Path,
    Method: row.Method,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_AUTH',
        Message: 'MSG_CREATE_APP_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_AUTH',
        Message: 'MSG_CREATE_APP_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
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
    TargetAppID: AppID.value,
    ID: selectedAuth.value[0].ID,
    EntID: selectedAuth.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_AUTH',
        Message: 'MSG_DELETE_APP_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_AUTH',
        Message: 'MSG_DELETE_APP_AUTH_FAIL',
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
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: npoolapi.API) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: npoolapi.API) => row.EntID
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
