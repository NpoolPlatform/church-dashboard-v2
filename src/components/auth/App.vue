<template>
  <q-table
    :title='$t("MSG_APP_RESOURCES")'
    dense
    :rows='displayAuths'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedAuth'
    class='table-row'
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
    :columns='columns'
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
          @click='onCreateAuthClick'
          :disable='selectedApi.length === 0'
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
</template>

<script setup lang='ts'>
import { ExpandAPI } from 'npool-cli-v2'
import { useChurchAuthingStore, NotifyType, Auth, formatTime } from 'npool-cli-v4'
import { getAPIs, updateAPI } from 'src/api/apis'
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchAPIStore } from 'src/teststore/apis'
import { API } from 'src/teststore/apis/types'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const api = useChurchAPIStore()
const apis = computed(() => api.APIs.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = useChurchAuthingStore()
const auths = computed(() => auth.Auths.get(appID.value) ? auth.Auths.get(appID.value) : [])
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))
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

const prepare = () => {
  if (!auths.value?.length) {
    getAppAuths(0, 100)
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

  auth.createAppAuth({
    TargetAppID: appID.value,
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
