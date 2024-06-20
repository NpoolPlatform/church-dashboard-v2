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
import { sdk } from 'src/npoolstore'

interface Props {
  gooId: string | undefined
}

const props = defineProps<Props>()
const gooId = toRef(props, 'gooId')
const target = ref(gooId.value)

const goods = sdk.goods
const _goods = computed(() => Array.from(goods.value, (el) => {
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

const emit = defineEmits<{(e: 'update:gooId', gooId: string | undefined): void}>()
const onUpdate = () => {
  emit('update:gooId', target.value)
}

onMounted(() => {
  if (goods.value.length === 0) {
    sdk.getGoods(0, 0)
  }
})
</script>
