<template>
  <q-select
    :disable='!readOnly ? false : true'
    v-model='target'
    :options='displayBrands'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_BRAND'
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
  vendorBrandId: string
  readOnly?: boolean
}

const props = defineProps<Props>()
const vendorBrandId = toRef(props, 'vendorBrandId')
const readOnly = toRef(props, 'readOnly')
const target = ref(vendorBrandId.value)

const brands = computed(() => Array.from(sdk.vendorBrands.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.EntID}`
  }
}))
const displayBrands = ref(brands.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayBrands.value = brands.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:vendorBrandId', vendorBrandId: string): void}>()
const onUpdate = () => {
  emit('update:vendorBrandId', target.value)
}

onMounted(() => {
  if (!brands.value.length) {
    sdk.getVendorBrands(0, 0)
  }
})
</script>
