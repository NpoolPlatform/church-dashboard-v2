<template>
  <q-table
    dense
    flat
    :title='$t("MSG_POWER_RENTALS")'
    :rows='displayPowerRentals'
    :columns='powerRentalColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedPowerRentals'
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
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedPowerRentals.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_POWER_RENTALS")'
    :rows='appPowerRentals'
    :columns='appPowerRentalsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedAppPowerRentals'
    @row-click='(ev, row, index) => onRowClick(row as apppowerrental.AppPowerRental)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_GOOD_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_UNAUTHORIZE")'
          @click='onUnAuthorizeClick'
          :disable='selectedAppPowerRentals.length === 0'
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
        <q-input v-model='target.AppGoodName' :label='$t("MSG_GOOD_NAME")' />
        <q-input v-model='target.UnitPrice' :label='$t("MSG_UNIT_PRICE")' type='number' :min='0' />
        <q-input v-model='target.MinOrderAmount' :label='$t("MSG_MIN_ORDER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MaxOrderAmount' :label='$t("MSG_MAX_ORDER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MaxUserAmount' :label='$t("MSG_MAX_USER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MinOrderDurationSeconds' :label='$t("MSG_MIN_ORDER_DURATION_SECONDS")' type='number' :min='0' />
        <q-input v-model='target.MaxOrderDurationSeconds' :label='$t("MSG_MAX_ORDER_DURATION_SECONDS")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='goodbase.CancelModes'
          v-model='target.CancelMode'
          :label='$t("MSG_CANCEL_MODE")'
        />
        <q-select
          :options='goodbase.StartModes'
          v-model='target.GoodStartMode'
          :label='$t("MSG_GOOD_START_MODE")'
        />
        <q-select :options='goodbase.GoodSaleModes' v-model='target.SaleMode' :label='$t("MSG_SALE_MODE")' />
        <q-input
          v-model.number='target.CancelableBeforeStartSeconds'
          :label='$t("MSG_CANCELLABLE_BEFORE_START_SECONDS")'
          type='number'
          :min='0'
          :disable='!sdk.appPowerRental.cancelable(target.AppGoodID)'
        />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
      </q-card-section>
      <q-card-section>
        <div>
          <DateTimePicker v-model:date='target.SaleStartAt' label='MSG_SALE_START_AT' />
        </div>
        <div>
          <DateTimePicker v-model:date='target.SaleEndAt' label='MSG_SALE_END_AT' />
        </div>
        <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnableSetCommission' :label='$t("MSG_ENABLE_SET_COMMISSION")' /></div>
        <div><q-toggle dense v-model='target.AppGoodPurchasable' :label='$t("MSG_ENABLE_PURCHASE")' /></div>
        <div><q-toggle dense v-model='target.EnableProductPage' :label='$t("MSG_ENABLE_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' /></div>
        <div><q-toggle dense v-model='target.AppGoodOnline' :label='$t("MSG_ONLINE")' /></div>
        <div><q-toggle dense v-model='target.PackageWithRequireds' :label='$t("MSG_PACKAGE_WITH_REQUIREDS")' /></div>
        <div><q-toggle dense v-model='target.FixedDuration' :label='$t("MSG_FIXED_DURATION")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <AppPowerRentalSimulate />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apppowerrental, utils, sdk, goodbase, powerrental } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppPowerRentalSimulate = defineAsyncComponent(() => import('src/components/good/AppPowerRentalSimulate.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const goodName = ref('')
const powerRentals = sdk.powerRentals
const selectedPowerRentals = ref([] as powerrental.PowerRental[])
const displayPowerRentals = computed(() => sdk.powerRentals?.value?.filter((el) => {
  const _name = goodName.value?.toLowerCase()
  return el.Name.toLowerCase()?.includes(_name) || el.GoodID.toLowerCase()?.includes(_name)
}))

const name = ref('')
const appPowerRentals = computed(() => sdk.appPowerRental.appPowerRentals.value.filter((el) => {
  const _name = name.value?.toLowerCase()
  return el.AppGoodName.toLowerCase()?.includes(_name) || el.AppGoodID.toLowerCase()?.includes(_name)
}))
const selectedAppPowerRentals = ref([] as Array<apppowerrental.AppPowerRental>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as apppowerrental.AppPowerRental)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as apppowerrental.AppPowerRental
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppPowerRental() : createAppPowerRental()
}

const updateAppPowerRental = () => {
  sdk.appPowerRental.adminUpdateAppPowerRental(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const createAppPowerRental = () => {
  target.value.GoodID = selectedPowerRentals.value?.[0]?.GoodID
  sdk.appPowerRental.adminCreateAppPowerRental(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: apppowerrental.AppPowerRental) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onUnAuthorizeClick = () => {
  sdk.appPowerRental.adminDeleteAppPowerRental(selectedAppPowerRentals.value?.[0], () => {
    // TODO
  })
}

watch(sdk.AppID, () => {
  if (!appPowerRentals.value.length) {
    sdk.appPowerRental.adminGetAppPowerRentals(0, 0)
  }
  if (!powerRentals.value.length) {
    sdk.getPowerRentals(0, 0)
  }
})

onMounted(() => {
  if (!appPowerRentals.value.length) {
    sdk.appPowerRental.adminGetAppPowerRentals(0, 0)
  }
  if (!powerRentals.value.length) {
    sdk.getPowerRentals(0, 0)
  }
})

const powerRentalColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.GoodID
  },
  {
    name: 'Title',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.GoodType
  },
  {
    name: 'UnitPrice',
    label: t('MSG_GOOD_UNIT_PRICE'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.UnitPrice
  },
  {
    name: 'QuantityUnit',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: powerrental.PowerRental) => t(row.QuantityUnit)
  },
  {
    name: 'QuantityUnitAmount',
    label: t('MSG_GOOD_UNIT_AMOUNT'),
    sortable: true,
    field: (row: powerrental.PowerRental) => t(row.QuantityUnitAmount)
  },
  {
    name: 'Total',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.Total
  },
  {
    name: 'Sold',
    label: t('MSG_GOOD_SOLD'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.Sold
  },
  {
    name: 'Locked',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.Locked
  },
  {
    name: 'InService',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.InService
  },
  {
    name: 'WaitStart',
    label: t('MSG_GOOD_WAITSTART'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.WaitStart
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: powerrental.PowerRental) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: powerrental.PowerRental) => utils.formatTime(row.ServiceStartAt)
  }
])

const appPowerRentalsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodType
  },
  {
    name: 'Online',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodOnline && row.AppGoodOnline
  },
  {
    name: 'Visible',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.Visible
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => utils.formatTime(row.ServiceStartAt)
  }
])

</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
