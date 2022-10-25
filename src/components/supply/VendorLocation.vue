<template>
  <q-table
    dense
    flat
    :title='$t("MSG_VENDOR_LOCATIONS")'
    :rows='locations'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as VendorLocation)'
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
        <span>{{ $t('MSG_CREATE_VENDOR_LOCATION') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Country' :label='$t("MSG_COUNTRY")' />
        <q-input v-model='target.Province' :label='$t("MSG_PROVINCE")' />
        <q-input v-model='target.City' :label='$t("MSG_CITY")' />
        <q-input v-model='target.Address' :label='$t("MSG_ADDRESS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useChurchVendorLocationStore } from 'src/teststore/good/vendorlocation'
import { VendorLocation } from 'src/teststore/good/vendorlocation/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const vendor = useChurchVendorLocationStore()
const locations = computed(() => vendor.VendorLocations.VendorLocations)

const target = ref({} as VendorLocation)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: VendorLocation) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as VendorLocation
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateVendorLocation(done) : createVendorLocation(done)
}

const createVendorLocation = (done: () => void) => {
  vendor.createVendorLocation({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_VENDOR_LOCATION'),
        Message: t('MSG_CREATE_VENDOR_LOCATION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_VENDOR_LOCATION'),
        Message: t('MSG_CREATE_VENDOR_LOCATION_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (v: VendorLocation, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateVendorLocation = (done: () => void) => {
  vendor.updateVendorLocation({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_VENDOR_LOCATION'),
        Message: t('MSG_UPDATE_VENDOR_LOCATION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_VENDOR_LOCATION'),
        Message: t('MSG_UPDATE_VENDOR_LOCATION_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (v: VendorLocation, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (vendor.VendorLocations.VendorLocations.length === 0) {
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
        Type: NotifyType.Error
      }
    }
  }, (vendorLocations: Array<VendorLocation>, error: boolean) => {
    if (error || vendorLocations.length < limit) {
      return
    }
    getVendorLocations(offset + limit, limit)
  })
}
</script>
