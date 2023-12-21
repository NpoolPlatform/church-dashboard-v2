<template>
  <q-select
    v-model='target'
    :options='displayTopMosts'
    options-selected-class='text-deep-orange'
    emit-value
    :label='label'
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
import { sdk } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

  interface Props {
    id: string
    label?: string
  }

const props = defineProps<Props>()
const id = toRef(props, 'id')
const label = toRef(props, 'label')
const target = ref(id.value)

const _topMosts = computed(() => sdk.topMosts.value)
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!topMosts.value?.length) {
    sdk.getTopMosts(0, 0)
  }
})
</script>
