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
import { getGoods } from 'src/api/good'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { good } from 'src/npoolstore'

interface Props {
  id: string | undefined
}

const props = defineProps<Props>()
const goodID = toRef(props, 'id')
const target = ref(goodID.value)

const _good = good.useGoodStore()
const goods = computed(() => Array.from(_good.goods(), (el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.Title} | ${el.QuantityUnit} | ${el.UnitPrice}`
  }
}))
const displayGoods = ref(goods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayGoods.value = goods.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string | undefined): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
})
</script>
