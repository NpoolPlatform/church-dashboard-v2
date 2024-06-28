<template>
  <q-select
    :disable='!readOnly ? false : true'
    v-model='target'
    :options='locations'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_VENDOR_LOCATION'
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
  vendorLocationId: string
  readOnly?: boolean
}

const props = defineProps<Props>()
const vendorLocationId = toRef(props, 'vendorLocationId')
const readOnly = toRef(props, 'readOnly')
const target = ref(vendorLocationId.value)

const locations = computed(() => Array.from(sdk.vendorLocations.value).map((el) => {
  return {
    value: el.EntID,
    label: el.Country + ' ' + el.Province + ' ' + el.City + ' ' + el.Address
  }
}))

const emit = defineEmits<{(e: 'update:vendorLocationId', vendorLocationId: string): void}>()
const onUpdate = () => {
  emit('update:vendorLocationId', target.value)
}

onMounted(() => {
  if (!sdk.vendorLocations.value.length) {
    sdk.getVendorLocations(0, 0)
  }
})
</script>
