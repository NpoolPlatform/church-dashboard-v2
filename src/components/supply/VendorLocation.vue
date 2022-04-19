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
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
import { NotificationType, VendorLocation, useVendorLocationStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const location = useVendorLocationStore()
const locations = computed(() => location.VendorLocations)

const target = ref({} as unknown as VendorLocation)

onMounted(() => {
  location.getVendorLocations({
    Message: {
      Error: {
        Title: t('MSG_GET_VENCOR_LOCATIONS'),
        Message: t('MSG_GET_VENCOR_LOCATIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (location: VendorLocation) => {
  updating.value = true
  showing.value = true
  target.value = location
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    location.updateVendorLocation({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_VENCOR_LOCATIONS'),
          Message: t('MSG_UPDATE_VENCOR_LOCATIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  location.createVendorLocation({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_VENCOR_LOCATIONS'),
        Message: t('MSG_UPDATE_VENCOR_LOCATIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as unknown as VendorLocation
}

</script>
