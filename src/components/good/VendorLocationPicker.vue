<template>
  <q-select
    :disable='!updating ? false : true'
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
import { useI18n } from 'vue-i18n'
import { vendorlocation, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  location: string
  updating?: boolean
}

const props = defineProps<Props>()
const location = toRef(props, 'location')
const updating = toRef(props, 'updating')
const target = ref(location.value)
const vendor = vendorlocation.useVendorLocationStore()

const locations = computed(() => Array.from(vendor.vendorLocations()).map((el) => {
  return {
    value: el.EntID,
    label: el.Country + ' ' + el.Province + ' ' + el.City + ' ' + el.Address
  }
}))

const emit = defineEmits<{(e: 'update:location', location: string): void}>()
const onUpdate = () => {
  emit('update:location', target.value)
}

onMounted(() => {
  if (!vendor.vendorLocations().length) {
    getVendorLocations(0, 500)
  }
})
const getVendorLocations = (offset: number, limit: number) => {
  vendor.getVendorLocations({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_VENDOR_LOCATIONS'),
        Message: t('MSG_GET_VENDOR_LOCATIONS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, vendorLocations?: Array<vendorlocation.VendorLocation>) => {
    if (error || !vendorLocations?.length) {
      return
    }
    getVendorLocations(offset + limit, limit)
  })
}
</script>
