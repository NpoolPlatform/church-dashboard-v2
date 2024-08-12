<template>
  <q-table
    dense
    flat
    :rows='malfunctions'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_GOOD_MALFUNCTIONS")'
    :rows-per-page-options='[20]'
    v-model:selected='selectedMalfunctions'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as goodmalfunction.Malfunction)'
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
          :disable='(selectedMalfunctions.length === 0)'
          @click='onDelete'
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
        <GoodSelector v-if='!updating' v-model:good-id='target.GoodID' label='MSG_GOOD_ID' />
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model.number='target.DurationSeconds' :label='$t("MSG_DURATION_SECONDS")' />
        <q-input v-model.number='target.CompensatedOrders' :label='$t("MSG_COMPENSATE_ORDERS")' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' :updating='updating' :label='$t("MSG_START_AT")' />
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
import { goodmalfunction, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const goods = sdk.goods
const malfunctions = sdk.goodMalfunctions

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as goodmalfunction.Malfunction)

const onRowClick = (row: goodmalfunction.Malfunction) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as goodmalfunction.Malfunction
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? adminUpdateMalfunction() : adminCreateMalfunction()
}

const adminCreateMalfunction = () => {
  sdk.adminCreateMalfunction(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const adminUpdateMalfunction = () => {
  sdk.adminUpdateMalfunction(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const selectedMalfunctions = ref([] as Array<goodmalfunction.Malfunction>)
const selectedMalfunction = computed(() => selectedMalfunctions.value[0])

const onDelete = () => {
  sdk.adminDeleteMalfunction(selectedMalfunction.value)
}

onMounted(() => {
  if (!goods.value.length) {
    sdk.getGoods(0, 0)
  }
  if (!malfunctions.value.length) {
    sdk.getMalfunctions(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.EntID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodType
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Title
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Message
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.StartAt
  },
  {
    name: 'DurationSeconds',
    label: t('MSG_DURATION_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.DurationSeconds
  },
  {
    name: 'CompensateSeconds',
    label: t('MSG_COMPENSATE_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.CompensateSeconds
  },
  {
    name: 'CompensatedOrders',
    label: t('MSG_COMPENSATED_ORDERS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.CompensatedOrders
  }
])
</script>
