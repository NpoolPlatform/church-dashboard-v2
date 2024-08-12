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
  topMostId: string
  label?: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'MSG_SELECT_TOPMOST',
  readOnly: false
})
const topMostId = toRef(props, 'topMostId')
const label = toRef(props, 'label')
const readOnly = toRef(props, 'readOnly')
const target = ref(topMostId.value)

const _topMosts = sdk.topMosts
const topMosts = computed(() => Array.from(_topMosts.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.Title} | ${el.EntID}`
  }
}))
const displayTopMosts = ref(topMosts.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayTopMosts.value = topMosts.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:topMostId', topMostId: string): void}>()
const onUpdate = () => {
  emit('update:topMostId', target.value)
}

onMounted(() => {
  if (!topMosts.value?.length) {
    sdk.adminGetTopMosts(0, 0)
  }
})
</script>
