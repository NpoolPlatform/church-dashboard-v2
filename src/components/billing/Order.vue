<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='goodId'
        :label='$t("MSG_GOOD_ID")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
      />
    </template>
  </q-table>
  <q-item>
    <span>{{ $t('MSG_TOTAL_SOLD') }}: {{ soldUnits }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_TIMEOUT') }}: {{ paymentTimeouts }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_USDT_AMOUNT') }}: {{ paymentAmount }} {{ PriceCoinName }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_ORDER_USER_COUNT') }}: {{ orderUsers }}</span>
  </q-item>
</template>

<script setup lang='ts'>
import { NotificationType, OrderBase, PaymentState, useChurchBillingStore, useChurchOrderStore, PriceCoinName } from 'npool-cli-v2'
import { AppGood, NotifyType, useChurchAppGoodStore } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch, ref } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyOrder extends OrderBase {
  GoodName: string
  PaymentState: PaymentState
  PaymentID: string
  Amount: number
  CoinUSDCurrency: number
}

const billing = useChurchBillingStore()
const payments = computed(() => billing.Payments.get(appID.value))

const good = useChurchAppGoodStore()
const goods = computed(() => good.getGoodsByAppID(appID.value))

const order = useChurchOrderStore()
const orders = computed(() => {
  const myOrders = order.BaseOrders.get(appID.value)
  if (!myOrders) {
    return [] as Array<MyOrder>
  }
  return Array.from(myOrders).map((el) => {
    const o = el as MyOrder
    o.PaymentState = 'MSG_NOT_AVAILABLE' as PaymentState
    o.GoodName = ''
    o.PaymentID = ''
    o.Amount = 0
    o.CoinUSDCurrency = 0
    if (payments.value) {
      const index = payments.value.findIndex((pel) => pel.OrderID === el.ID)
      if (index >= 0) {
        o.PaymentState = payments.value[index].State as PaymentState
        o.PaymentID = payments.value[index].ID
        o.Amount = payments.value[index].Amount
        o.CoinUSDCurrency = payments.value[index].CoinUSDCurrency
      }
    }

    const index = goods.value.findIndex((gl) => gl.GoodID === el.GoodID)
    if (index >= 0) {
      o.GoodName = goods.value[index].GoodName
    }
    return o
  })
})

const goodId = ref('')
const start = ref('')
const end = ref('')

const displayOrders = computed(() => orders.value.filter((el) => {
  let display = el.GoodID.includes(goodId.value)
  if (start.value.length) {
    display = display && (el.CreateAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreateAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

const soldUnits = computed(() => displayOrders.value.filter((el) => el.PaymentState === PaymentState.DONE).reduce((sum, b) => sum + b.Units, 0))
const paymentTimeouts = computed(() => displayOrders.value.filter((el) => el.PaymentState === PaymentState.TIMEOUT).length)
const paymentAmount = computed(() => displayOrders.value.filter((el) => el.PaymentState === PaymentState.DONE).reduce((sum, b) => sum + b.Amount * b.CoinUSDCurrency, 0))
const orderUsers = computed(() => {
  const users = new Map<string, number>()
  displayOrders.value.filter((el) => el.PaymentState === PaymentState.DONE).forEach((el) => {
    let u = users.get(el.UserID)
    if (!u) {
      u = 0
    }
    u += el.Units
    users.set(el.UserID, u)
  })
  return users.size
})

const prepare = () => {
  order.getBaseOrders({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  billing.getPayments({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_PAYMENTS',
        Message: 'MSG_GET_PAYMENTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
  if (goods.value.length === 0) {
    getAppGoods(0, 500)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>
