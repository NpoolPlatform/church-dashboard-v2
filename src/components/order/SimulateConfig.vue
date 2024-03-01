<template>
  <q-table
    dense
    flat
    :title='$t("MSG_SIMULATE_CONFIGS")'
    :rows='sdk.simulateConfigs.value'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    selection='single'
    v-model:selected='selectedSimulate'
    @row-click='(evt, row, index) => onRowClick(row as simulateconfig.SimulateConfig)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedSimulate.length === 0'
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
        <span>{{ $t('MSG_CREATE_SIMULATE_CONFIG') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='simulateconfig.SendCouponModes' v-model='target.SendCouponMode' :label='$t("MSG_SEND_COUPON_MODE")' />
        <q-input v-model='target.SendCouponProbability' :label='$t("MSG_SEND_COUPON_PROBABILITY")' />
        <q-input v-model='target.CashableProfitProbability' :label='$t("MSG_CASHABLE_PROFIT_PROBABILITY")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnabledCashableProfit' :label='$t("MSG_ENABLED_CASHABLE_PROFIT")' /></div>
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Enabled' :label='$t("MSG_ENABLED")' /></div>
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
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/api/app'
import { simulateconfig, notify, sdk } from 'src/npoolstore'

const selectedSimulate = ref([] as Array<simulateconfig.SimulateConfig>)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _simulateconfig = simulateconfig.useSimulateConfigStore()

const target = ref({} as simulateconfig.SimulateConfig)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as simulateconfig.SimulateConfig
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: simulateconfig.SimulateConfig) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppSimulateConfig(done) : createAppSimulateConfig(done)
}

const onDelete = () => {
  if (selectedSimulate.value.length === 0) {
    return
  }

  _simulateconfig.deleteAppSimulateConfig({
    TargetAppID: AppID.value,
    ID: selectedSimulate.value[0].ID,
    EntID: selectedSimulate.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_SIMULATE_CONFIG',
        Message: 'MSG_DELETE_APP_SIMULATE_CONFIG_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_SIMULATE_CONFIG',
        Message: 'MSG_DELETE_APP_SIMULATE_CONFIG_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const createAppSimulateConfig = (done: () => void) => {
  done()
  sdk.createAppSimulateConfig(target.value)
  onMenuHide()
}

const updateAppSimulateConfig = (done: () => void) => {
  done()
  sdk.updateAppSimulateConfig(target.value)
  onMenuHide()
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!sdk.simulateConfigs.value.length) {
    sdk.getAppSimulateConfigs(0, 0)
  }
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.AppID
  },
  {
    name: 'SendCouponMode',
    label: t('MSG_SEND_COUPON_MODE'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.SendCouponMode
  },
  {
    name: 'SendCouponProbability',
    label: t('MSG_SEND_COUPON_PROBABILITY'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.SendCouponProbability
  },
  {
    name: 'EnabledCashableProfit',
    label: t('MSG_ENABLED_CASHABLE_PROFIT'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.EnabledCashableProfit
  },
  {
    name: 'CashableProfitProbability',
    label: t('MSG_CASHABLE_PROFIT_PROBABILITY'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.CashableProfitProbability
  },
  {
    name: 'Enabled',
    label: t('MSG_ENABLED'),
    sortable: true,
    field: (row: simulateconfig.SimulateConfig) => row.Enabled
  }
])
</script>

<style lang='sass' scoped>
</style>
