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
import { AppID } from 'src/api/app'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
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
    value: el.ID,
    label: `${el.Title} | ${el.Unit}`
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

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
}
</script>
