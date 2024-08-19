<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICE_TYPES")'
    :rows='deviceTypes'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as devicetype.DeviceType)'
    selection='single'
    v-model:selected='selectedDeviceTypes'
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
          :disable='selectedDeviceType === undefined'
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
        <span>{{ $t('MSG_DEVICE') }}</span>
      </q-card-section>
      <q-card-section>
        <DeviceManufacturerSelector v-model:device-manufacturer-id='target.ManufacturerID' />
        <q-input type='number' v-model='target.PowerConsumption' :label='$t("MSG_POWER_CONSUMPTION")' suffix='W' />
        <DatePicker v-model:date='target.ShipmentAt' :updating='updating' :label='$t("MSG_SHIPMENT_AT")' />
        <q-input v-model='target.Type' :label='$t("MSG_DEVICE_TYPE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { devicetype, utils, sdk } from 'src/npoolstore'

import DeviceManufacturerSelector from './DeviceManufacturerSelector.vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))

const deviceTypes = sdk.deviceTypes

const target = ref({} as devicetype.DeviceType)
const selectedDeviceTypes = ref([] as devicetype.DeviceType[])
const selectedDeviceType = computed(() => selectedDeviceTypes.value[0])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: devicetype.DeviceType) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateDevice() : createDevice()
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as devicetype.DeviceType
  showing.value = false
  submitting.value = false
}

const updateDevice = () => {
  sdk.adminUpdateDeviceType(target.value, () => {
    onMenuHide()
  })
}

const createDevice = () => {
  sdk.adminCreateDeviceType(target.value, () => {
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.adminDeleteDeviceType(selectedDeviceType.value, () => {
    selectedDeviceTypes.value = []
  })
}

onMounted(() => {
  if (!deviceTypes.value.length) {
    sdk.getDeviceTypes(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: devicetype.DeviceType) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: devicetype.DeviceType) => row.EntID
  },
  {
    name: 'ManufacturerID',
    label: t('MSG_MANUFACTURER'),
    sortable: true,
    field: (row: devicetype.DeviceType) => row.ManufacturerID
  },
  {
    name: 'PowerConsumption',
    label: t('MSG_PowerConsumption'),
    sortable: true,
    field: (row: devicetype.DeviceType) => row.PowerConsumption
  },
  {
    name: 'ShipmentAt',
    label: t('MSG_SHIPMENT_AT'),
    sortable: true,
    field: (row: devicetype.DeviceType) => utils.formatTime(row.ShipmentAt)
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: devicetype.DeviceType) => row.Type
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: devicetype.DeviceType) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: devicetype.DeviceType) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
