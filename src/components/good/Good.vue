<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='displayGoods'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as good.Good)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_GOOD_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
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
        <span>{{ $t('MSG_CREATE_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.QuantityUnit' :label='$t("MSG_UNIT")' />
        <q-input v-model='target.QuantityUnitAmount' :label='$t("MSG_UNIT_POWER")' />
        <q-input v-model='target.UnitPrice' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <DatePicker v-model:date='target.DeliveryAt' :updating='updating' :label='$t("MSG_DELIVERY_AT")' />
        <DatePicker v-model:date='target.StartAt' :updating='updating' :label='$t("MSG_START_AT")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Total' :label='$t("MSG_GOOD_TOTAL")' type='number' :min='1' />
        <q-input v-model.number='target.BenefitIntervalHours' :label='$t("MSG_BENEFIT_INTERVAL_HOURS")' type='number' :min='1' />
        <q-input v-model='target.UnitLockDeposit' :label='$t("MSG_UNIT_LOCK_DEPOSIT")' />
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:id='target.CoinTypeID' />
        <DeviceInfoPicker v-model:device='target.DeviceInfoID' />
        <VendorLocationPicker v-model:location='target.VendorLocationID' />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_LABELS'
          filled
          v-model='target.Labels'
          multiple
          :options='goodbase.GoodLabels'
        />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_POSTERS'
          filled
          v-model='target.Posters'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <q-select :options='goodbase.BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
        <q-select :options='goodbase.GoodTypes' v-model='target.GoodType' :label='$t("MSG_GOOD_TYPE")' />
        <q-select :options='goodbase.StartModes' v-model='target.StartMode' :label='$t("MSG_START_MODE")' />
        <q-select :options='goodbase.GoodUnitTypes' v-model='target.UnitType' :label='$t("MSG_GOOD_UNIT_TYPE")' />
        <q-select :options='goodbase.GoodUnitCalculateTypes' v-model='target.QuantityCalculateType' :label='$t("MSG_QUANTITY_CALCULATE_TYPE")' />
        <q-select :options='goodbase.GoodDurationTypes' v-model='target.DurationType' :label='$t("MSG_DURATION_TYPE")' />
        <q-select :options='goodbase.GoodUnitCalculateTypes' v-model='target.DurationCalculateType' :label='$t("MSG_DURATION_CALCULATE_TYPE")' />
        <q-select :options='goodbase.GoodSettlementTypes' v-model='target.SettlementType' :label='$t("MSG_SETTLEMENT_TYPE")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.TestOnly' :label='$t("MSG_TESTONLY")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { getGoods } from 'src/api/good'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { good, notify, utils, goodbase } from 'src/npoolstore'

const DeviceInfoPicker = defineAsyncComponent(() => import('src/components/good/DeviceInfoPicker.vue'))
const VendorLocationPicker = defineAsyncComponent(() => import('src/components/good/VendorLocationPicker.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _good = good.useGoodStore()
const goods = computed(() => _good.goods())

const username = ref('')
const displayGoods = computed(() => {
  const name = username.value?.toLowerCase()
  return goods.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.QuantityUnit.toLowerCase().includes(name) ||
          el.Title.toLowerCase().includes(name)
  })
})

const target = ref({
  UnitLockDeposit: '0',
  StartMode: goodbase.StartMode.GoodStartModeNextDay
} as good.Good)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: good.Good) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateGood(done) : createGood(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  showing.value = false
  updating.value = false
  target.value = {} as good.Good
}

const createGood = (done: () => void) => {
  _good.createGood({
    ...target.value,
    Total: `${target.value.Total}`,
    Message: {
      Error: {
        Title: t('MSG_CREATE_GOOD'),
        Message: t('MSG_CREATE_GOOD_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_GOOD'),
        Message: t('MSG_CREATE_GOOD_SUCCESS'),
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

const targetUpdate = computed(() => {
  return {
    ID: target.value.ID,
    EntID: target.value.EntID,
    DeviceInfoID: target.value.DeviceInfoID,
    CoinTypeID: target.value.CoinTypeID,
    VendorLocationID: target.value.VendorLocationID,
    UnitPrice: target.value.UnitPrice,
    Title: target.value.Title,
    QuantityUnit: target.value.QuantityUnit,
    QuantityUnitAmount: target.value.QuantityUnitAmount,
    DeliveryAt: target.value.DeliveryAt,
    BenefitIntervalHours: target.value.BenefitIntervalHours,
    StartAt: target.value.StartAt,
    Total: target.value.Total,
    TestOnly: target.value.TestOnly,
    UnitLockDeposit: target.value?.UnitLockDeposit,
    Posters: target.value?.Posters,
    Labels: target.value?.Labels,
    StartMode: target.value.StartMode,
    BenefitType: target.value.BenefitType,
    GoodType: target.value.GoodType
  }
})

const updateGood = (done: () => void) => {
  _good.updateGood({
    ...targetUpdate.value,
    Total: `${targetUpdate.value.Total}`,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_GOOD'),
        Message: t('MSG_UPDATE_GOOD_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_GOOD'),
        Message: t('MSG_UPDATE_GOOD_SUCCESS'),
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

onMounted(() => {
  if (!goods.value.length) {
    getGoods(0, 500)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: good.Good) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: good.Good) => row.EntID
  },
  {
    name: 'Title',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: good.Good) => row.Title
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.GoodType
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: good.Good) => row.UnitPrice
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: good.Good) => t(row.QuantityUnit)
  },
  {
    name: 'GOODUNITAMOUNT',
    label: t('MSG_GOOD_UNIT_AMOUNT'),
    sortable: true,
    field: (row: good.Good) => t(row.QuantityUnitAmount)
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: good.Good) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    sortable: true,
    field: (row: good.Good) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: good.Good) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: good.Good) => row.InService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: good.Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: good.Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.StartAt)
  },
  {
    name: 'CREATEDAT',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UNITTYPE',
    label: t('MSG_UNIT_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.UnitType
  },
  {
    name: 'QUANTITYCALCULATETYPE',
    label: t('MSG_QUANTITY_CALCULATE_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.QuantityCalculateType
  },
  {
    name: 'DURATIONTYPE',
    label: t('MSG_DURATION_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.DurationType
  },
  {
    name: 'DURATIONCALCULATETYPE',
    label: t('MSG_DURATION_CALCULATE_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.DurationCalculateType
  },
  {
    name: 'SETTLEMENTTYPE',
    label: t('MSG_SETTLEMENT_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.SettlementType
  }
])
</script>

<style lang='sass' scoped>
</style>
