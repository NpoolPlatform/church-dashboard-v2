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
import { buildOrders, NotificationType, OrderGroup, OrderModel, useChurchOrderStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const order = useChurchOrderStore()
const orders = computed(() => {
  const myOrders = order.Orders.get(appID.value)
  if (!myOrders) {
    return [] as Array<OrderModel>
  }
  return buildOrders(myOrders, OrderGroup.ALL)
})

const prepare = () => {
  order.getOrders({
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
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
