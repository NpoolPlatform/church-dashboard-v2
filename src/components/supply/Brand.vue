<template>
  <q-table
    dense
    flat
    :title='$t("MSG_BRAND")'
    :rows='brands'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as vendorbrand.VendorBrand)'
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { vendorbrand, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const vendor = vendorbrand.useVendorBrandStore()
const brands = computed(() => vendor.vendorBrands())

const target = ref({} as vendorbrand.VendorBrand)

const showing = ref(false)
const updating = ref(false)

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
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateVendorBrand(done) : createVendorBrand(done)
}

const createVendorBrand = (done: () => void) => {
  vendor.createVendorBrand({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_VENDOR_BRAND'),
        Message: t('MSG_CREATE_VENDOR_BRAND_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_VENDOR_BRAND'),
        Message: t('MSG_CREATE_VENDOR_BRAND_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateVendorBrand = (done: () => void) => {
  vendor.updateVendorBrand({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_VENDOR_BRAND'),
        Message: t('MSG_UPDATE_VENDOR_BRAND_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_VENDOR_BRAND'),
        Message: t('MSG_UPDATE_VENDOR_BRAND_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
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
        Title: t('MSG_GET_BRAND'),
        Message: t('MSG_GET_BRAND_FAIL'),
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
