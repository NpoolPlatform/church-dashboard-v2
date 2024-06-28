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
  <OrderPage />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_FEE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='_appFees' v-model='selectedAppFee' :label='$t("MSG_APP_FEE")' />
        <OrderSelector v-model:order-id='parentOrderId' />
        <q-select
          :options='displayUsers'
          use-input
          v-model='selectedUser'
          :label='$t("MSG_USER")'
          @filter='filterUser'
        />
        <q-input
          :label='$t("MSG_DURATIONS")'
          v-model='durations'
          :suffix='durationUnit'
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
import { appfee, order, user, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const OrderSelector = defineAsyncComponent(() => import('src/components/order/OrderSelector.vue'))

const appFees = sdk.appFees

interface MyGood {
  label: string
  value: appfee.AppFee
}
const _appFees = computed(() => Array.from(appFees.value).map((el) => {
  return {
    label: `${el.GoodName} | ${el.ID} | ${el.GoodType}`,
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

const selectedAppFee = ref(undefined as unknown as MyGood)
const selectedUser = ref(undefined as unknown as MyUser)
const parentOrderId = ref('')
const durations = ref(3)

const durationUnit = computed(() => sdk.durationUnit(selectedAppFee.value?.value?.DurationDisplayType))
const durationSeconds = computed(() => sdk.durationUnitSeconds(selectedAppFee.value?.value?.DurationDisplayType) * durations.value)

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
  selectedAppFee.value = undefined as unknown as MyGood
  selectedUser.value = undefined as unknown as MyUser
  submitting.value = false
}

const onSubmit = () => {
  if (!selectedAppFee.value) {
    return
  }
  if (!selectedUser.value) {
    return
  }
  if (!parentOrderId.value.length) {
    return
  }
  sdk.adminCreateFeeOrder({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value.value.EntID,
    ParentOrderID: parentOrderId.value,
    DurationSeconds: durationSeconds.value,
    AppGoodID: selectedAppFee.value.value.EntID,
    OrderType: orderType.value
  }, () => {
    onMenuHide()
  })
}

const orderType = ref(order.OrderType.Offline as order.OrderType.Airdrop | order.OrderType.Offline)

const prepare = () => {
  if (users.value.length === 0) {
    sdk.adminGetUsers(0, 0)
  }
  if (appFees.value?.length === 0) {
    sdk.adminGetAppFees(0, 0)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
