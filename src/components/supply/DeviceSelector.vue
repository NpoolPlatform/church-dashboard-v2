<template>
  <q-select
    :disable='!readOnly ? false : true'
    v-model='target'
    :options='displayChains'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_DEVICE_TYPES'
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
  deviceTypeId: string
  readOnly?: boolean
}

const props = defineProps<Props>()
const deviceTypeId = toRef(props, 'deviceTypeId')
const readOnly = toRef(props, 'readOnly')
const target = ref(deviceTypeId.value)

const deviceTypes = computed(() => Array.from(sdk.deviceTypes.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Type} | ${el.EntID}`
  }
}))

const displayChains = ref(deviceTypes.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayChains.value = deviceTypes.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:deviceTypeId', deviceTypeId: string): void}>()
const onUpdate = () => {
  emit('update:deviceTypeId', target.value)
}

onMounted(() => {
  if (!deviceTypes.value?.length) {
    sdk.getDeviceTypes(0, 0)
  }
})

</script>
