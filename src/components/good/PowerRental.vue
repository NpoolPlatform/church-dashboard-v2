<template>
  <q-table
    dense
    flat
    :title='$t("MSG_POWER_RENTALS")'
    :rows='displayPowerRentals'
    row-key='ID'
    :rows-per-page-options='[20]'
    :columns='columns'
    @row-click='(ev, row, index) => onRowClick(row as powerrental.PowerRental)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
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
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.QuantityUnit' :label='$t("MSG_QUANTITY_UNIT")' />
        <q-input v-model='target.QuantityUnitAmount' :label='$t("MSG_QUANTITY_UNIT_AMOUNT")' />
        <q-input v-model='target.UnitPrice' :label='$t("MSG_UNIT_PRICE")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.BenefitIntervalHours' :label='$t("MSG_BENEFIT_INTERVAL_HOURS")' type='number' :min='1' />
        <q-input v-model.number='target.UnitLockDeposit' type='number' :min='0' :label='$t("MSG_UNIT_LOCK_DEPOSIT")' />
      </q-card-section>
      <q-card-section>
        <DeviceInfoPicker v-model:device-type-id='target.DeviceTypeID' />
        <VendorLocationPicker v-model:vendor-location-id='target.VendorLocationID' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.DeliveryAt' :updating='updating' :label='$t("MSG_DELIVERY_AT")' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.ServiceStartAt' :updating='updating' :label='$t("MSG_SERVICE_START_AT")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Total' :label='$t("MSG_GOOD_TOTAL")' type='number' :min='1' />
      </q-card-section>
      <q-card-section>
        <q-select :options='goodbase.BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
        <q-select :options='goodbase.GoodTypes' v-model='target.GoodType' :label='$t("MSG_GOOD_TYPE")' />
        <q-select :options='goodbase.StartModes' v-model='target.StartMode' :label='$t("MSG_START_MODE")' />
        <q-select :options='goodbase.GoodDurationTypes' v-model='target.DurationDisplayType' :label='$t("MSG_DURATION_DISPLAY_TYPE")' />
        <q-select :options='goodbase.GoodStockModes' v-model='target.StockMode' :label='$t("MSG_STOCK_MODE")' />
      </q-card-section>
      <q-card-section>
        <q-toggle dense v-model='target.TestOnly' :label='$t("MSG_TEST_ONLY")' />
        <div><q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' /></div>
        <div><q-toggle dense v-model='target.Purchase' :label='$t("MSG_PURCHASEABLE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { good, utils, sdk, powerrental, goodbase } from 'src/npoolstore'
import DeviceInfoPicker from './DeviceInfoPicker.vue'
import VendorLocationPicker from './VendorLocationPicker.vue'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const goods = sdk.powerRentals

const goodName = ref('')
const displayPowerRentals = computed(() => {
  const name = goodName.value.toLowerCase()
  return goods.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.Name.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!goods.value.length) {
    sdk.getPowerRentals(0, 0)
  }
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as powerrental.PowerRental)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: powerrental.PowerRental) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as powerrental.PowerRental
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updatePowerRental() : createPowerRental()
}

const onCancel = () => {
  onMenuHide()
}

const createPowerRental = () => {
  sdk.adminCreatePowerRental(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updatePowerRental = () => {
  sdk.adminUpdatePowerRental(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

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
    name: 'Name',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: good.Good) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.GoodType
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: good.Good) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.CreatedAt)
  }
])

</script>

<style lang='sass' scoped>
</style>
