<template>
  <q-select
    v-model='target'
    :options='_deviceTypes'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_DEVICE'
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
    label: el.Type
  }
}))

const emit = defineEmits<{(e: 'update:device', device: string): void}>()
const onUpdate = () => {
  emit('update:device', target.value)
}

onMounted(() => {
  if (!deviceTypes.value.length) {
    sdk.getDeviceTypes(0, 0)
  }
})
</script>
