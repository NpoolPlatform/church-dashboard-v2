<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICES")'
    :rows='devices'
    :columns='columns'
    row-key='ID'
    ::rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as DeviceInfo)'
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
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useChurchDeviceInfoStore, DeviceInfo, formatTime } from 'npool-cli-v4'
import { getDeviceInfos } from 'src/api/good'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const deviceInfo = useChurchDeviceInfoStore()
const devices = computed(() => deviceInfo.DeviceInfos.DeviceInfos)

const target = ref({} as DeviceInfo)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: DeviceInfo) => {
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
  target.value = {} as DeviceInfo
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
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_DEVICE'),
        Message: t('MSG_UPDATE_DEVICE_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (d: DeviceInfo, error: boolean) => {
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
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_DEVICE'),
        Message: t('MSG_CREATE_DEVICE_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (d: DeviceInfo, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (deviceInfo.DeviceInfos.DeviceInfos.length === 0) {
    getDeviceInfos(0, 500)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: DeviceInfo) => row.ID
  },
  {
    name: 'MANUFACTURER',
    label: t('MSG_MANUFACTURER'),
    field: (row: DeviceInfo) => row.Manufacturer
  },
  {
    name: 'POWERCOMSUPTION',
    label: t('MSG_POWERCOMSUPTION'),
    field: (row: DeviceInfo) => row.PowerComsuption
  },
  {
    name: 'SHIPMENTAT',
    label: t('MSG_SHIPMENT_AT'),
    field: (row: DeviceInfo) => row.ShipmentAt
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    field: (row: DeviceInfo) => row.Type
  },
  {
    name: 'CREATED_AT',
    label: t('MSG_CREATED_AT'),
    field: (row: DeviceInfo) => formatTime(row.CreatedAt)
  },
  {
    name: 'UPDATED_AT',
    label: t('MSG_UPDATED_AT'),
    field: (row: DeviceInfo) => formatTime(row.UpdatedAt)
  }
])
</script>
