<template>
  <q-select
    v-model='target'
    :options='displayAppGoods'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APP_GOODS'
    map-options
    use-input
    @update:model-value='onUpdate'
    @filter='onFilter'
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
import { sdk, goodbase } from 'src/npoolstore'

interface Props {
  appGoodId: string | undefined
  goodIds?: string[]
  requiredAppGoodIds: Array<string>
  goodTypes?: Array<goodbase.GoodType>
  excludeAppGoodIds?: string[]
}

const props = defineProps<Props>()
const appGoodId = toRef(props, 'appGoodId')
const goodIds = toRef(props, 'goodIds')
const requiredAppGoodIds = toRef(props, 'requiredAppGoodIds')
const excludeAppGoodIds = toRef(props, 'excludeAppGoodIds')
const goodTypes = toRef(props, 'goodTypes')
const target = ref(appGoodId.value)

const appGoods = computed(() => sdk.appGoods.value.filter((el) => {
  let display = true
  if (requiredAppGoodIds.value !== undefined) {
    const index = requiredAppGoodIds.value.findIndex((gl) => gl === el.EntID)
    display = display && (index > -1)
  }
  if (goodTypes.value !== undefined && goodTypes.value?.length > 0) {
    const index = goodTypes.value.findIndex((gl) => gl === el.GoodType)
    display = display && (index > -1)
  }
  display = display && (!goodIds.value || goodIds.value?.includes(el.GoodID))
  return display && (!excludeAppGoodIds.value || !excludeAppGoodIds.value?.includes(el.EntID))
}))

const goods = computed(() => Array.from(appGoods.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.AppGoodName} | ${el.EntID} | ${el.GoodType} | ${el.GoodID}`
  }
}))

const displayAppGoods = ref(goods.value)

const emit = defineEmits<{(e: 'update:appGoodId', appGoodId: string | undefined): void}>()
const onUpdate = () => {
  emit('update:appGoodId', target.value)
}

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayAppGoods.value = goods.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

watch(requiredAppGoodIds, () => {
  displayAppGoods.value = goods.value
})

watch(sdk.AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (appGoods.value.length === 0) {
    sdk.adminGetAppGoods(0, 0)
  }
}
</script>
