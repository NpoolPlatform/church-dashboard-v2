<template>
  <q-select
    v-model='target'
    :options='displayTopMosts'
    options-selected-class='text-deep-orange'
    emit-value
    :label='$t(label)'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
    :disable='readOnly'
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
import { sdk } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, withDefaults } from 'vue'

interface Props {
  topMostGoodId: string
  label?: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'MSG_SELECT_TOPMOST_GOOD',
  readOnly: false
})
const topMostGoodId = toRef(props, 'topMostGoodId')
const label = toRef(props, 'label')
const readOnly = toRef(props, 'readOnly')
const target = ref(topMostGoodId.value)

const _topMostGoods = sdk.topMostGoods
const topMostGoods = computed(() => Array.from(_topMostGoods.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.AppGoodID} | ${el.EntID}`
  }
}))
const displayTopMosts = ref(topMostGoods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayTopMosts.value = topMostGoods.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:topMostGoodId', topMostGoodId: string): void}>()
const onUpdate = () => {
  emit('update:topMostGoodId', target.value)
}

onMounted(() => {
  if (!topMostGoods.value?.length) {
    sdk.adminGetTopMosts(0, 0)
  }
})
</script>
