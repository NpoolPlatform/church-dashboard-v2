<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DEVICE_POSTERS")'
    :rows='posters'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as deviceposter.DevicePoster)'
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
          :disable='selectedPoster === undefined'
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
        <span>{{ $t('MSG_DEVICE_POSTER') }}</span>
      </q-card-section>
      <q-card-section>
        <DeviceSelector v-if='!updating' v-model:device-type-id='target.DeviceTypeID' />
        <q-input v-model='target.Poster' :label='$t("MSG_POSTER")' />
        <q-input v-model.number='target.Index' :label='$t("MSG_INDEX")' />
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
import { useI18n } from 'vue-i18n'
import { deviceposter, utils, sdk } from 'src/npoolstore'

import DeviceSelector from './DeviceSelector.vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const posters = sdk.devicePosters

const target = ref({} as deviceposter.DevicePoster)
const selectedPosters = ref([] as deviceposter.DevicePoster[])
const selectedPoster = computed(() => selectedPosters.value[0])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: deviceposter.DevicePoster) => {
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
  target.value = {} as deviceposter.DevicePoster
  showing.value = false
  submitting.value = false
}

const updateDevice = () => {
  sdk.adminUpdateDevicePoster(target.value, () => {
    onMenuHide()
  })
}

const createDevice = () => {
  sdk.adminCreateDevicePoster(target.value, () => {
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.adminDeleteDevicePoster(selectedPoster.value, () => {
    selectedPosters.value = []
  })
}

onMounted(() => {
  if (!posters.value.length) {
    sdk.getDevicePosters(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: deviceposter.DevicePoster) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: deviceposter.DevicePoster) => row.EntID
  },
  {
    name: 'Poster',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: deviceposter.DevicePoster) => row.Poster
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: deviceposter.DevicePoster) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: deviceposter.DevicePoster) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
