<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICES")'
    :rows='devices'
    row-key='ID'
    :rows-per-page-options='[10]'
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
        <q-input type='number' v-model='target.Consumption' :label='$t("MSG_CONSUMPTION")' suffix='W' />
        <q-input type='date' v-model='shipmentAt' :label='$t("MSG_SHIPMENT_AT")' />
        <q-input v-model='target.Type' :label='$t("MSG_DEVICE_TYPE")' />
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
import { NotificationType, useDeviceStore, DeviceInfo, formatTime } from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const device = useDeviceStore()
const devices = computed(() => device.Devices)

const target = ref({} as unknown as DeviceInfo)
const shipmentAt = ref('')
watch(shipmentAt, () => {
  target.value.ShipmentAt = new Date(shipmentAt.value).getTime() / 1000
})

onMounted(() => {
  device.getDevices({
    Message: {
      Error: {
        Title: t('MSG_GET_DEVICES'),
        Message: t('MSG_GET_DEVICES_FAIL'),
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

const onRowClick = (device: DeviceInfo) => {
  updating.value = true
  showing.value = true
  target.value = device
  shipmentAt.value = formatTime(target.value.ShipmentAt)
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    device.updateDevice({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_DEVICES'),
          Message: t('MSG_UPDATE_DEVICES_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  device.createDevice({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_DEVICES'),
        Message: t('MSG_UPDATE_DEVICES_FAIL'),
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
  target.value = {} as unknown as DeviceInfo
}

</script>
