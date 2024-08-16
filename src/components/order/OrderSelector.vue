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
import { order, goodbase, sdk } from 'src/npoolstore'

interface Props {
  orderId: string
  userIds?: string[]
  orderTypes?: order.OrderType[]
  goodTypes?: Array<goodbase.GoodType>
  orderStates?: Array<order.OrderState>
}

const props = defineProps<Props>()
const orderId = toRef(props, 'orderId')
const userIds = toRef(props, 'userIds')
const orderTypes = toRef(props, 'orderTypes')
const goodTypes = toRef(props, 'goodTypes')
const orderStates = toRef(props, 'orderStates')

const target = ref(orderId.value)

const orders = computed(() => Array.from(sdk.orders.value).filter((el) => {
  let display = true
  if (orderTypes.value !== undefined && orderTypes.value?.length > 0) {
    const index = orderTypes.value.findIndex((gl) => gl === el.OrderType)
    display = display && (index > -1)
  }
  if (goodTypes.value !== undefined && goodTypes.value?.length > 0) {
    const index = goodTypes.value.findIndex((gl) => gl === el.GoodType)
    display = display && (index > -1)
  }
  if (orderStates.value !== undefined && orderStates.value?.length > 0) {
    const index = orderStates.value.findIndex((gl) => gl === el.OrderState)
    display = display && (index > -1)
  }
  return display && (!userIds.value || userIds.value?.includes(el.UserID))
}))

const _orders = computed(() => Array.from(orders.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.OrderType} | ${el.AppGoodID} | ${el.AppGoodName} | ${el.GoodType}`
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
  if (!sdk.orders.value?.length) {
    sdk.adminGetOrders(0, 0)
  }
})

onMounted(() => {
  if (!sdk.orders.value?.length) {
    sdk.adminGetOrders(0, 0)
  }
})
</script>
