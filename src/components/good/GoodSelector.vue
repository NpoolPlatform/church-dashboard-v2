<template>
  <q-select
    v-model='target'
    :options='displayGoods'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_GOODS'
    map-options
    @update:model-value='onUpdate'
    use-input
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { goodbase, sdk } from 'src/npoolstore'

interface Props {
  goodId: string | undefined,
  ignoreGoodTypes?: Array<goodbase.GoodType>
}

const props = defineProps<Props>()
const goodId = toRef(props, 'goodId')
const ignoreGoodTypes = toRef(props, 'ignoreGoodTypes')
const target = ref(goodId.value)

const goods = sdk.goods
const showGoods = computed(() => goods.value.filter((el) => {
  if (ignoreGoodTypes.value !== undefined && ignoreGoodTypes.value?.length > 0) {
    const index = ignoreGoodTypes.value.findIndex((gl) => gl === el.GoodType)
    return index === -1
  }
  return true
}))

const _goods = computed(() => Array.from(showGoods.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.Name} | ${el.GoodType}`
  }
}))

const displayGoods = ref(_goods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayGoods.value = _goods.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:goodId', goodId: string | undefined): void}>()
const onUpdate = () => {
  emit('update:goodId', target.value)
}

onMounted(() => {
  if (goods.value.length === 0) {
    sdk.getGoods(0, 0)
  }
})
</script>
