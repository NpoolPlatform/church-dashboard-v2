<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_CONFIG")'
    :rows='displayCoinConfigs'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedCoinConfig'
    @row-click='(evt, row, index) => onRowClick(row as inspirecoinconfig.CoinConfig)'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='cointypeid'
        :label='$t("MSG_COIN_TYPE_ID")'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='(selectedCoinConfig.length === 0)'
        @click='onDelete'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ updating ? $t('MSG_UPDATE_COIN_CONFIG_SETTING') : $t('MSG_CREATE_COIN_CONFIG_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <AppCoinPicker v-model:coin-type-id='target.CoinTypeID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.MaxValue' :label='$t("MSG_MAX_VALUE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { AppID } from 'src/npoolstore/sdk'
import { useI18n } from 'vue-i18n'
import { inspirecoinconfig, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))

const _coinconfig = inspirecoinconfig.useCoinConfigStore()
const coinconfigs = computed(() => _coinconfig.coinConfigs())

const cointypeid = ref('')
const displayCoinConfigs = computed(() => coinconfigs.value.filter((el) => {
  return el.CoinTypeID?.includes(cointypeid.value) || el.CoinName?.includes(cointypeid.value)
}))

const target = ref({} as inspirecoinconfig.CoinConfig)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as inspirecoinconfig.CoinConfig
  showing.value = true
  updating.value = false
}
const onRowClick = (row: inspirecoinconfig.CoinConfig) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as inspirecoinconfig.CoinConfig
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCoinConfig(done) : createCoinConfig(done)
}

const updateCoinConfig = (done: () => void) => {
  _coinconfig.adminUpdateCoinConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_APP_CONFIG'),
        Message: t('MSG_UPDATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_APP_CONFIG'),
        Message: t('MSG_UPDATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const createCoinConfig = (done: () => void) => {
  _coinconfig.adminCreateCoinConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_APP_CONFIG'),
        Message: t('MSG_CREATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_APP_CONFIG'),
        Message: t('MSG_CREATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
    prepare()
  })
}

const selectedCoinConfig = ref([] as Array<inspirecoinconfig.CoinConfig>)
const onDelete = () => {
  selectedCoinConfig.value.forEach((el) => {
    _coinconfig.adminDeleteCoinConfig({
      ID: el.ID,
      EntID: el.EntID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_COIN_CONFIG',
          Message: 'MSG_DELETE_COIN_CONFIG_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const prepare = () => {
  getCoinConfigs(0, 100)
}

onMounted(() => {
  if (!coinconfigs.value?.length) {
    getCoinConfigs(0, 100)
  }
})

watch(AppID, () => {
  target.value.AppID = AppID.value
  prepare()
})

const getCoinConfigs = (offset: number, limit: number) => {
  _coinconfig.adminGetCoinConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_CONFIGS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspirecoinconfig.CoinConfig>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCoinConfigs(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.AppID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.CoinTypeID
  },
  {
    name: 'MaxValue',
    label: t('MSG_MAX_VALUE'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.MaxValue
  },
  {
    name: 'Allocated',
    label: t('MSG_ALLOCATED'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.Allocated
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.CoinName
  },
  {
    name: 'DisplayNames',
    label: t('MSG_DISPLAY_NAMES'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.DisplayNames.join(',')
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspirecoinconfig.CoinConfig) => utils.formatTime(row.CreatedAt)
  }
])

</script>
