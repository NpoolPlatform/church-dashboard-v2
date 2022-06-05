<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='orders'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, OrderBase, PaymentState, useAdminGoodStore, useChurchBillingStore, useChurchOrderStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyOrder extends OrderBase {
  PaymentState: PaymentState
  PaymentID: string
  GoodName: string
}

const billing = useChurchBillingStore()
const payments = computed(() => billing.Payments.get(appID.value))

const good = useAdminGoodStore()

const order = useChurchOrderStore()
const orders = computed(() => {
  const myOrders = order.BaseOrders.get(appID.value)
  if (!myOrders) {
    return [] as Array<MyOrder>
  }
  return Array.from(myOrders).map((el) => {
    const o = el as MyOrder
    o.PaymentState = 'MSG_NOT_AVAILABLE' as PaymentState
    if (payments.value) {
      const index = payments.value.findIndex((pel) => pel.OrderID === el.ID)
      if (index >= 0) {
        o.PaymentState = payments.value[index].State as PaymentState
        o.PaymentID = payments.value[index].ID
      }
    }

    const index = good.Goods.findIndex((gel) => gel.Good.Good.ID === el.GoodID)
    if (index >= 0) {
      o.GoodName = good.Goods[index].Good.Good.Title
    }
    return o
  })
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
  good.getAllGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_ALL_GOODS',
        Message: 'MSG_GET_ALL_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
