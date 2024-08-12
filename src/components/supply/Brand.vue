<template>
  <q-table
    dense
    flat
    :title='$t("MSG_BRAND")'
    :rows='brands'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as vendorbrand.VendorBrand)'
    selection='single'
    v-model:selected='selectedBrands'
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
          :disable='selectedBrand === undefined'
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
        <span>{{ $t('MSG_CREATE_VENDOR_BRAND') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LOGO")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { vendorbrand, sdk } from 'src/npoolstore'

const brands = sdk.vendorBrands

const target = ref({} as vendorbrand.VendorBrand)
const selectedBrands = ref([] as vendorbrand.VendorBrand[])
const selectedBrand = computed(() => selectedBrands.value[0])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: vendorbrand.VendorBrand) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as vendorbrand.VendorBrand
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateVendorBrand() : createVendorBrand()
}

const createVendorBrand = () => {
  sdk.adminCreateVendorBrand(target.value, () => {
    onMenuHide()
  })
}

const updateVendorBrand = () => {
  sdk.adminUpdateVendorBrand(target.value, () => {
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.adminDeleteVendorBrand(selectedBrand.value, () => {
    selectedBrands.value = []
  })
}

onMounted(() => {
  if (!brands.value.length) {
    sdk.getVendorBrands(0, 0)
  }
})
</script>
