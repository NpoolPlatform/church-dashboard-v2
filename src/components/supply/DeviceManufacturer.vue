<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICE_MANUFACTURERS")'
    :rows='manufacturers'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as devicemanufacturer.Manufacturer)'
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
        <span>{{ $t('MSG_DEVICE_MANUFACTURER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LOGO")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { devicemanufacturer, utils, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const manufacturers = sdk.deviceManufactueres

const target = ref({} as devicemanufacturer.Manufacturer)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: devicemanufacturer.Manufacturer) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = () => {
  showing.value = false
  updating.value ? updateDevice() : createDevice()
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as devicemanufacturer.Manufacturer
  showing.value = false
}

const updateDevice = () => {
  sdk.adminUpdateDeviceManufacturer(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const createDevice = () => {
  sdk.adminCreateDeviceManufacturer(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

onMounted(() => {
  if (!manufacturers.value.length) {
    sdk.getDeviceManufacturers(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => row.EntID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => row.Name
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => row.Logo
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: devicemanufacturer.Manufacturer) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
