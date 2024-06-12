<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayEvents'
    options-selected-class='text-deep-orange'
    emit-value
    :label='myLabel'
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
import { getAppEvents } from 'src/api/inspire'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { eventinspire } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
  label?: string,
  getData?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')
const getData = toRef(props, 'getData')

const myLabel = computed(() => {
  return !label.value ? 'MSG_EVENTS' : label.value
})

const target = ref(id.value)

const _event = eventinspire.useEventStore()
const events = computed(() => Array.from(_event.events()).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EventType} | ${el.EntID}`
  }
}))
const displayEvents = ref(events.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayEvents.value = events.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!events.value.length && (getData.value === undefined || getData.value === false)) {
    getAppEvents(0, 100)
  }
})
</script>
