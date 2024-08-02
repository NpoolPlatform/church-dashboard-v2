<template>
  <div class='row'>
    <q-space />
    <q-btn
      dense
      flat
      class='btn flat'
      :label='$t("MSG_CREATE")'
      @click='onCreate'
    />
  </div>
  <OrderPage
    :good-types='[goodbase.GoodType.PowerRental, goodbase.GoodType.LegacyPowerRental]'
    :order-types='[OrderType.Offline, OrderType.Airdrop]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ selectedAppPowerRental?.GoodTotal }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ selectedAppPowerRental?.AppGoodLocked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ selectedAppPowerRental?.AppGoodInService }}</q-item-label>
        <AppGoodSelector
          v-model:app-good-id='target.AppGoodID'
          :good-types='[goodbase.GoodType.PowerRental, goodbase.GoodType.LegacyPowerRental]'
        />
        <AppUserSelector v-model:id='target.UserID' />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxPurchaseUnits'
        />
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model='orderType'
          rounded
          :options='[
            {label: order.OrderType.Offline, value: order.OrderType.Offline},
            {label: order.OrderType.Airdrop, value: order.OrderType.Airdrop}
          ]'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, ref, watch, onMounted } from 'vue'
import { order, sdk, goodbase, powerrentalorder } from 'src/npoolstore'
import { OrderType } from 'src/npoolstore/order/const'

const AppID = sdk.AppID

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const appPowerRentals = sdk.appPowerRental.onlineAppPowerRentals

const target = ref({} as powerrentalorder.PowerRentalOrder)
const selectedAppPowerRental = computed(() => {
  console.log(sdk.appPowerRental.appPowerRental(target.value?.AppGoodID))
  return sdk.appPowerRental.appPowerRental(target.value?.AppGoodID)
})

const units = ref(1)
const maxPurchaseUnits = computed(() => sdk.appPowerRental.purchaseLimit(target.value?.AppGoodID))

const showing = ref(false)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
}

const _order = order.useOrderStore()
const onSubmit = () => {
  if (units.value > maxPurchaseUnits.value) {
    console.log('max units: ', maxPurchaseUnits.value)
    return
  }
  if (!target.value?.AppGoodID) {
    return
  }
  if (target.value?.UserID?.length <= 0) {
    return
  }
  sdk.powerRentalOrder.adminCreatePowerRentalOrder({
    TargetAppID: AppID.value,
    TargetUserID: target.value?.UserID,
    AppGoodID: target.value?.AppGoodID,
    Units: `${units.value}`,
    OrderType: orderType.value,
    InvestmentType: order.InvestmentType.FullPayment,
    AppGoodStockID: selectedAppPowerRental.value?.AppGoodStockID as string
  }, (error: boolean) => {
    if (error) return
    onMenuHide()
    _order.$reset()
    sdk.adminGetOrders(0, 0)
  })
}

const orderType = ref(order.OrderType.Offline as order.OrderType.Airdrop | order.OrderType.Offline)

const prepare = () => {
  if (appPowerRentals.value?.length === 0) {
    sdk.appPowerRental.adminGetAppPowerRentals(0, 0)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
