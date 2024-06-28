<template>
  <q-select
    :disable='!readOnly ? false : true'
    v-model='target'
    :options='displayChains'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_DEVICE_MANUFACTURERS'
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
  deviceManufacturerId: string
  readOnly?: boolean
}

const props = defineProps<Props>()
const deviceManufacturerId = toRef(props, 'deviceManufacturerId')
const readOnly = toRef(props, 'readOnly')
const target = ref(deviceManufacturerId.value)

const manufacturers = computed(() => Array.from(sdk.deviceManufactueres.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.EntID}`
  }
}))

const displayChains = ref(manufacturers.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayChains.value = manufacturers.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:deviceManufacturerId', deviceManufacturerId: string): void}>()
const onUpdate = () => {
  emit('update:deviceManufacturerId', target.value)
}

onMounted(() => {
  if (!manufacturers.value?.length) {
    sdk.getChains(0, 0)
  }
})

</script>
