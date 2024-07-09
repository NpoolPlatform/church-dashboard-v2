<template>
  <q-select
    v-model='target'
    :options='displayOrders'
    options-selected-class='text-deep-orange'
    emit-value
    :label='$t("MSG_SELECT_ORDER")'
    map-options
    use-input
    @filter='onFilter'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
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
    label: `${el.GoodName} | ${el.EntID} | ${el.AppGoodID} | ${el.GoodType}`
  }
}))

const displayOrders = ref(_orders.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayOrders.value = _orders.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:orderId', orderId: string): void}>()
const onUpdate = () => {
  emit('update:orderId', target.value)
}

watch(sdk.AppID, () => {
  if (!orders.value.length) {
    sdk.getOrders(0, 0)
  }
})

onMounted(() => {
  if (!orders.value.length) {
    sdk.getOrders(0, 0)
  }
})
</script>
