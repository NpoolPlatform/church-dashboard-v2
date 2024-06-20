<template>
  <q-select
    v-model='target'
    :options='_orders'
    options-selected-class='text-deep-orange'
    emit-value
    :label='$t("MSG_SELECT_ORDER")'
    map-options
    @update:model-value='onUpdate'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { order, sdk } from 'src/npoolstore'

interface Props {
  orderId: string
  orderTypes?: order.OrderType[]
}

const props = defineProps<Props>()
const orderId = toRef(props, 'orderId')

const target = ref(orderId.value)
const orders = sdk.orders

const _orders = computed(() => Array.from(orders.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.GoodName} | ${el.EntID}`
  }
}))

const emit = defineEmits<{(e: 'update:orderId', orderId: string): void}>()
const onUpdate = () => {
  emit('update:orderId', target.value)
}

onMounted(() => {
  if (!orders.value.length) {
    sdk.getOrders(0, 0)
  }
})
</script>
