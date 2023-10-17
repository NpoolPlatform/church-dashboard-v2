<template>
  <q-select
    :disable='!updating ? false : true'
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
import { vendorbrand, notify } from 'src/npoolstore'

  interface Props {
    id: string
    updating?: boolean
  }

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const vendor = vendorbrand.useVendorBrandStore()
const brands = computed(() => Array.from(vendor.vendorBrands()).map((el) => {
  return {
    value: el.ID,
    label: `${el.Name} | ${el.ID}`
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!brands.value.length) {
    getVendorBrands(0, 100)
  }
})

const getVendorBrands = (offset: number, limit: number) => {
  vendor.getVendorBrands({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_BRAND',
        Message: 'MSG_GET_BRAND_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, vendorbrands?: Array<vendorbrand.VendorBrand>) => {
    if (error || !vendorbrands?.length) {
      return
    }
    getVendorBrands(offset + limit, limit)
  })
}
</script>
