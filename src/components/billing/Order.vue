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
</template>

<script setup lang='ts'>
import { NotificationType, OrderBase, PaymentState, useAdminGoodStore, useChurchBillingStore, useChurchOrderStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch, ref } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyOrder extends OrderBase {
  GoodName: string
  PaymentState: PaymentState
  PaymentID: string
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
    o.GoodName = ''
    o.PaymentID = ''
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
