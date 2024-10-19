<template>
  <q-select
    v-model='target'
    :options='_taskConfigs'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_TaskConfig'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { sdk } from 'src/npoolstore'
import { AppID } from 'src/npoolstore/sdk'

interface Props {
  id: string
}

const props = defineProps<Props>()
const taskConfigId = toRef(props, 'id')
const target = ref(taskConfigId.value)

const taskConfigs = sdk.taskConfigs
const _taskConfigs = computed(() => Array.from(taskConfigs.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.Name}`
  }
}))

const displayTaskConfigs = ref(_taskConfigs.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayTaskConfigs.value = _taskConfigs.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  const targetAppID = AppID.value
  if (!taskConfigs.value.length) {
    sdk.getTaskConfigs(targetAppID, 0, 0)
  }
})
</script>
