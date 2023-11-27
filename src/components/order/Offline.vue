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
        <span>{{ $t('MSG_CREATE_OFFLINE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ selectedGood?.value?.GoodTotal }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ selectedGood?.value?.AppGoodLocked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ selectedGood?.value?.AppGoodInService }}</q-item-label>
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_APP_GOOD")' />
        <q-select
          :options='displayUsers'
          use-input
          v-model='selectedUser'
          :label='$t("MSG_USER")'
          @filter='filterUser'
        />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxUnits'
          :suffix='selectedGood?.value?.Unit'
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { getAppCoins } from 'src/api/coin'
import { getAppUsers } from 'src/api/user'
import { defineAsyncComponent, computed, ref, watch, onMounted } from 'vue'
import { AppID } from 'src/api/app'
import { appgood, order, user, appcoin, sdk } from 'src/npoolstore'

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const good = appgood.useAppGoodStore()
const appGoods = computed(() => good.goods(AppID.value))

interface MyGood {
  label: string
  value: appgood.Good
}
const goods = computed(() => Array.from(appGoods.value.filter((el) => el.Online)).map((el) => {
  return {
    label: `${el.GoodName} | ${el.ID}`,
    value: el
  } as MyGood
}))

interface MyUser {
  label: string
  value: user.User
}

const _user = user.useUserStore()
const users = computed(() => Array.from(_user.appUsers(AppID.value)).map((el) => {
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

const selectedGood = ref(undefined as unknown as MyGood)
const selectedUser = ref(undefined as unknown as MyUser)

const units = ref(1)
const maxUnits = computed(() => Number(selectedGood.value?.value?.GoodSpotQuantity))

const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  selectedGood.value = undefined as unknown as MyGood
  selectedUser.value = undefined as unknown as MyUser
}

const onSubmit = () => {
  if (units.value > maxUnits.value) {
    return
  }
  if (!selectedGood.value) {
    return
  }
  if (!selectedUser.value) {
    return
  }

  sdk.createAppUserOrder({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value.value.EntID,
    AppGoodID: selectedGood.value.value.ID,
    Units: `${units.value}`,
    OrderType: orderType.value,
    InvestmentType: order.InvestmentType.FullPayment
  })

  onMenuHide()
}

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.coins(AppID.value))

const orderType = ref(order.OrderType.Offline as order.OrderType.Airdrop | order.OrderType.Offline)

const prepare = () => {
  if (users.value.length === 0) {
    getAppUsers(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

watch(AppID, () => {
  if (coins.value?.length === 0) {
    getAppCoins(0, 500)
  }
})

onMounted(() => {
  if (coins.value?.length === 0) {
    getAppCoins(0, 500)
  }
})
</script>
