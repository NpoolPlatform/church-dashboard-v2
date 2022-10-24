<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='devices'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_DEVICE'
    @update:model-value='onUpdate'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useChurchDeviceInfoStore } from 'src/teststore/good/deviceinfo'
import { DeviceInfo } from 'src/teststore/good/deviceinfo/types'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
interface Props {
  device: string
  updating: boolean
}

const props = defineProps<Props>()
const device = toRef(props, 'device')
const updating = toRef(props, 'updating')
const target = ref(device.value)
const deviceInfo = useChurchDeviceInfoStore()

const devices = computed(() => Array.from(deviceInfo.DeviceInfos.DeviceInfos).map((el) => {
  return {
    value: el.ID,
    label: el.Type
  }
}))

const emit = defineEmits<{(e: 'update:device', device: string): void}>()
const onUpdate = () => {
  emit('update:device', target.value)
}

onMounted(() => {
  if (deviceInfo.DeviceInfos.DeviceInfos.length === 0) {
    getDeviceInfos(0, 500)
  }
})

const getDeviceInfos = (offset: number, limit: number) => {
  deviceInfo.getDeviceInfos({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_DEVICES'),
        Message: t('MSG_GET_DEVICES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (devices: Array<DeviceInfo>, error: boolean) => {
    if (error || devices.length < limit) {
      return
    }
    getDeviceInfos(offset + limit, limit)
  })
}
</script>
