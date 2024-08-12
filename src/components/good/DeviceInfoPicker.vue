<template>
  <q-select
    v-model='target'
    :options='_deviceTypes'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_DEVICE'
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

interface Props {
  deviceTypeId: string
}

const props = defineProps<Props>()
const deviceTypeId = toRef(props, 'deviceTypeId')
const target = ref(deviceTypeId.value)

const deviceTypes = sdk.deviceTypes
const _deviceTypes = computed(() => Array.from(deviceTypes.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.Type} | ${el.ManufacturerName}| ${el.PowerConsumption}`
  }
}))

const displayDeviceTypes = ref(_deviceTypes.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayDeviceTypes.value = _deviceTypes.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:deviceTypeId', deviceTypeId: string): void}>()
const onUpdate = () => {
  emit('update:deviceTypeId', target.value)
}

onMounted(() => {
  if (!deviceTypes.value.length) {
    sdk.getDeviceTypes(0, 0)
  }
})
</script>
