<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDER_CONFIGS")'
    :rows='appOrderConfigs'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    selection='single'
    v-model:selected='selectedAppConfig'
    @row-click='(evt, row, index) => onRowClick(row as apporderconfig.AppConfig)'
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
          :disable='selectedAppConfig.length === 0'
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
        <span>{{ $t('MSG_CREATE_ORDER_CONFIG') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='apporderconfig.SimulateOrderCouponModes' v-model='target.SimulateOrderCouponMode' :label='$t("MSG_SIMULATE_ORDER_COUPON_MODE")' />
        <q-input v-model='target.SimulateOrderCouponProbability' :label='$t("MSG_SIMULATE_ORDER_COUPON_PROBABILITY")' />
        <q-input v-model='target.SimulateOrderCashableProfitProbability' :label='$t("MSG_SIMULATE_ORDER_CASHABLE_PROFIT_PROBABILITY")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnableSimulateOrder' :label='$t("MSG_ENABLE_SIMULATE_ORDER")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/api/app'
import { apporderconfig, sdk } from 'src/npoolstore'

const selectedAppConfig = ref([] as Array<apporderconfig.AppConfig>)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const appOrderConfigs = sdk.appOrderConfigs

const target = ref({} as apporderconfig.AppConfig)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as apporderconfig.AppConfig
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: apporderconfig.AppConfig) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppConfig(done) : createAppConfig(done)
}

const onDelete = () => {
  selectedAppConfig.value.forEach((el) => {
    sdk.adminDeleteAppOrderConfig(el)
  })
}

const createAppConfig = (done: () => void) => {
  done()
  sdk.adminCreateAppOrderConfig(target.value)
  onMenuHide()
}

const updateAppConfig = (done: () => void) => {
  done()
  sdk.adminUpdateAppOrderConfig(target.value)
  onMenuHide()
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!appOrderConfigs.value.length) {
    sdk.getAppOrderConfigs(0, 0)
  }
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.AppID
  },
  {
    name: 'SimulateOrderCouponMode',
    label: t('MSG_SIMULATE_ORDER_COUPON_MODE'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.SimulateOrderCouponMode
  },
  {
    name: 'SimulateOrderCouponProbability',
    label: t('MSG_SIMULATE_ORDER_COUPON_PROBABILITY'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.SimulateOrderCouponProbability
  },
  {
    name: 'SimulateOrderCashableProfitProbability',
    label: t('MSG_SIMULATE_ORDER_CASHABLE_PROFIT_PROBABILITY'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.SimulateOrderCashableProfitProbability
  },
  {
    name: 'EnableSimulateOrder',
    label: t('MSG_ENABLE_SIMULATE_ORDER'),
    sortable: true,
    field: (row: apporderconfig.AppConfig) => row.EnableSimulateOrder
  }
])
</script>

<style lang='sass' scoped>
</style>
