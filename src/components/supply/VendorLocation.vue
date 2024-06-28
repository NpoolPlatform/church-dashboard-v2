<template>
  <q-table
    dense
    flat
    :title='$t("MSG_VENDOR_LOCATIONS")'
    :rows='locations'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as vendorlocation.VendorLocation)'
    selection='single'
    v-model:selected='selectedLocations'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedLocation === undefined'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_VENDOR_LOCATION') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Country' :label='$t("MSG_COUNTRY")' />
        <q-input v-model='target.Province' :label='$t("MSG_PROVINCE")' />
        <q-input v-model='target.City' :label='$t("MSG_CITY")' />
        <q-input v-model='target.Address' :label='$t("MSG_ADDRESS")' />
      </q-card-section>
      <q-card-section>
        <BrandPicker v-model:vendor-brand-id='target.BrandID' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { vendorlocation, sdk } from 'src/npoolstore'

const BrandPicker = defineAsyncComponent(() => import('src/components/supply/BrandPicker.vue'))

const locations = sdk.vendorLocations

const target = ref({} as vendorlocation.VendorLocation)
const selectedLocations = ref([] as vendorlocation.VendorLocation[])
const selectedLocation = computed(() => selectedLocations.value[0])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: vendorlocation.VendorLocation) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as vendorlocation.VendorLocation
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateVendorLocation() : createVendorLocation()
}

const createVendorLocation = () => {
  sdk.adminCreateVendorLocation(target.value, () => {
    onMenuHide()
  })
}

const updateVendorLocation = () => {
  sdk.adminUpdateVendorLocation(target.value, () => {
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.adminDeleteVendorLocation(selectedLocation.value, () => {
    selectedLocations.value = []
  })
}

onMounted(() => {
  if (!locations.value.length) {
    sdk.getVendorLocations(0, 0)
  }
})
</script>
