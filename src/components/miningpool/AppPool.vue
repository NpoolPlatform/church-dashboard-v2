<template>
  <q-table
    :title='$t("MSG_APP_POOLS")'
    dense
    :rows='displayAppPools'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedAppPool'
    :columns='appPoolColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedPool.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_APP_POOL') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='apppoolName'
          :label='$t("MSG_APP_POOL_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_UNAUTHORIZE")'
          @click='onDeleteAuthClick'
          :disable='selectedAppPool.length === 0'
        />
      </div>
    </template>
  </q-table>

  <q-table
    :title='$t("MSG_POOLS")'
    dense
    :rows='displayPools'
    row-key='ID'
    :rows-per-page-options='[100]'
    v-model:selected='selectedPool'
    :columns='columns'
    selection='single'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolpool.Pool)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedPool.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_POOL') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='poolName'
          :label='$t("MSG_POOL_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onCreateAuthClick(selectedPool?.[0])'
          :disable='selectedPool.length === 0'
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
      <pre>{{ JSON.stringify(target,null,'  ') }}</pre>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { getPools } from 'src/api/miningpool'
import { AppID } from 'src/api/app'
import { useI18n } from 'vue-i18n'
import { miningpoolapppool, miningpoolpool, notify } from 'src/npoolstore'
import { computed, onMounted, ref, watch } from 'vue'

const apppoolInfo = miningpoolapppool.useMiningpoolAppPoolStore()
const appPools = computed(() => apppoolInfo.pools(AppID.value))
const selectedAppPool = ref([] as Array<miningpoolapppool.Pool>)
const apppoolName = ref('')
const displayAppPools = computed(() => appPools.value.filter((pool) => pool.Name.includes(apppoolName.value)))

const poolInfo = miningpoolpool.useMiningpoolPoolStore()
const pools = computed(() => poolInfo.Pools)
const displayPools = computed(() => pools.value?.filter((pool) => pool.Name.includes(poolName.value)))
const poolName = ref('')
const selectedPool = ref([] as Array<miningpoolpool.Pool>)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const getAppPools = (offset: number, limit: number) => {
  apppoolInfo.adminGetPools({
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
  }, (error: boolean, rows?: Array<miningpoolapppool.Pool>) => {
    if (error || !rows?.length) {
      return
    }
    getAppPools(offset + limit, limit)
  })
}

const prepare = () => {
  if (!appPools.value?.length) {
    getAppPools(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (pools.value.length === 0) {
    getPools(0, 500)
  }
  prepare()
})

const target = ref({} as miningpoolpool.Pool)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: miningpoolpool.Pool) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onMenuHide = () => {
  target.value = {} as miningpoolpool.Pool
  showing.value = false
}

const onCreateAuthClick = (row: miningpoolpool.Pool) => {
  apppoolInfo.adminCreatePool({
    TargetAppID: AppID.value,
    PoolID: row.EntID,
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
  if (selectedAppPool.value.length === 0) {
    return
  }

  apppoolInfo.adminDeletePool({
    TargetAppID: AppID.value,
    ID: selectedAppPool.value[0].ID,
    EntID: selectedAppPool.value[0].EntID,
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

const appPoolColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.EntID
  },
  {
    name: 'APP_ID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.AppID
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.MiningpoolType
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Name
  },
  {
    name: 'SITE',
    label: t('MSG_SITE'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Site
  },
  {
    name: 'LOGO',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Logo
  },
  {
    name: 'DESCRIPTION',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Description
  }
])

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.EntID
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.MiningpoolType
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Name
  },
  {
    name: 'SITE',
    label: t('MSG_SITE'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Site
  },
  {
    name: 'LOGO',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Logo
  },
  {
    name: 'DESCRIPTION',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Description
  }
])
</script>
