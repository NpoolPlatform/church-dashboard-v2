<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICES")'
    :rows='devices'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as deviceinfo.DeviceInfo)'
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
        <span>{{ $t('MSG_CREATE_DEVICE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Manufacturer' :label='$t("MSG_MANUFACTURER")' />
        <q-input type='number' v-model='target.PowerComsuption' :label='$t("MSG_POWER_CONSUMPTION")' suffix='W' />
        <DatePicker v-model:date='target.ShipmentAt' :updating='updating' :label='$t("MSG_SHIPMENT_AT")' />
        <q-input v-model='target.Type' :label='$t("MSG_DEVICE_TYPE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { getDeviceInfos } from 'src/api/good'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { deviceinfo, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const deviceInfo = deviceinfo.useDeviceInfoStore()
const devices = computed(() => deviceInfo.deviceInfos())

const target = ref({} as deviceinfo.DeviceInfo)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: deviceinfo.DeviceInfo) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateDevice(done) : createDevice(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as deviceinfo.DeviceInfo
  showing.value = false
}

const updateDevice = (done: () => void) => {
  deviceInfo.updateDeviceInfo({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_DEVICE'),
        Message: t('MSG_UPDATE_DEVICE_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_DEVICE'),
        Message: t('MSG_UPDATE_DEVICE_SUCCESS'),
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

const createDevice = (done: () => void) => {
  deviceInfo.createDeviceInfo({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_DEVICE'),
        Message: t('MSG_CREATE_DEVICE_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_DEVICE'),
        Message: t('MSG_CREATE_DEVICE_SUCCESS'),
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
  if (!devices.value.length) {
    getDeviceInfos(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => row.ID
  },
  {
    name: 'MANUFACTURER',
    label: t('MSG_MANUFACTURER'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => row.Manufacturer
  },
  {
    name: 'POWERCOMSUPTION',
    label: t('MSG_POWERCOMSUPTION'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => row.PowerComsuption
  },
  {
    name: 'SHIPMENTAT',
    label: t('MSG_SHIPMENT_AT'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => row.ShipmentAt
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => row.Type
  },
  {
    name: 'CREATED_AT',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UPDATED_AT',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: deviceinfo.DeviceInfo) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
