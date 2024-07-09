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
    :order-types='[OrderType.Offline]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_POWERRENTAL_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ selectedAppPowerRental?.value?.GoodTotal }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ selectedAppPowerRental?.value?.AppGoodLocked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ selectedAppPowerRental?.value?.AppGoodInService }}</q-item-label>
        <q-select :options='_appPowerRentals' v-model='selectedAppPowerRental' :label='$t("MSG_APP_GOOD")' />
        <q-select
          :options='displayUsers'
          use-input
          v-model='selectedUser'
          :label='$t("MSG_USER")'
          @filter='filterUser'
        />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxPurchaseUnits'
          :suffix='selectedAppPowerRental?.value?.QuantityUnit'
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
import { apppowerrental, order, user, sdk, goodbase } from 'src/npoolstore'
import { OrderType } from 'src/npoolstore/order/const'

const AppID = sdk.AppID

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))

const appPowerRentals = sdk.onlineAppPowerRentals

interface MyGood {
  label: string
  value: apppowerrental.AppPowerRental
}
const _appPowerRentals = computed(() => Array.from(appPowerRentals.value).map((el) => {
  return {
    label: `${el.GoodName} | ${el.ID}`,
    value: el
  } as MyGood
}))

interface MyUser {
  label: string
  value: user.User
}

const users = computed(() => Array.from(sdk.appUsers.value).map((el) => {
  return {
    label: el.EmailAddress?.length ? el.EmailAddress : el.PhoneNO,
    value: el
  } as MyUser
}))

const displayUsers = ref(users.value)
const filterUser = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el.value.EmailAddress?.toLowerCase().includes(val.toLowerCase()) ||
            el.value.PhoneNO?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const selectedAppPowerRental = ref(undefined as unknown as MyGood)
const selectedUser = ref(undefined as unknown as MyUser)

const units = ref(1)
const maxPurchaseUnits = computed(() => sdk.appPowerRentalMaxPurchasedUnits(selectedAppPowerRental.value?.value?.AppGoodID))

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
  selectedAppPowerRental.value = undefined as unknown as MyGood
  selectedUser.value = undefined as unknown as MyUser
  submitting.value = false
}

const onSubmit = () => {
  if (units.value > maxPurchaseUnits.value) {
    return
  }
  if (!selectedAppPowerRental.value) {
    return
  }
  if (!selectedUser.value) {
    return
  }
  sdk.adminCreatePowerRentalOrder({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value.value.EntID,
    AppGoodID: selectedAppPowerRental.value.value.AppGoodID,
    Units: `${units.value}`,
    OrderType: orderType.value,
    InvestmentType: order.InvestmentType.FullPayment,
    AppGoodStockID: selectedAppPowerRental.value.value.AppGoodStockID
  })

  onMenuHide()
}

const coins = sdk.appCoins
const orderType = ref(order.OrderType.Offline as order.OrderType.Airdrop | order.OrderType.Offline)

const prepare = () => {
  if (users.value.length === 0) {
    sdk.adminGetUsers(0, 0)
  }
  if (coins.value?.length === 0) {
    sdk.adminGetAppCoins(0, 0)
  }
  if (appPowerRentals.value?.length === 0) {
    sdk.adminGetAppPowerRentals(0, 0)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
