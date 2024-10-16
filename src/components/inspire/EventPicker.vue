<template>
  <q-select
    v-model='target'
    :options='_eventInspires'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_EVENT'
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
const eventId = toRef(props, 'id')
const target = ref(eventId.value)

const eventInspires = sdk.eventInspires
const _eventInspires = computed(() => Array.from(eventInspires.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.EventType}`
  }
}))

const displayEvents = ref(_eventInspires.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayEvents.value = _eventInspires.value.filter((el) => {
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
  if (!eventInspires.value.length) {
    sdk.getEventInspires(targetAppID, 0, 0)
  }
})
</script>
