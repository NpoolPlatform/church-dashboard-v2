<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_POWERRENTAL_SIMULATES")'
    :rows='simulates'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='appSimulateGoodsColumns'
    selection='single'
    v-model:selected='selectedSimulate'
    @row-click='(evt, row, index) => onRowClick(row as apppowerrentalsimulate.Simulate)'
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
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedSimulate.length === 0'
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
        <span>{{ $t('MSG_APP_SIMULATE_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:app-good-id='target.AppGoodID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.OrderUnits' :label='$t("MSG_ORDER_UNITS")' />
        <q-input v-model='target.OrderDurationSeconds' :label='$t("MSG_ORDER_DURATION")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/api/app'
import { apppowerrentalsimulate, utils, sdk } from 'src/npoolstore'

const selectedSimulate = ref([] as Array<apppowerrentalsimulate.Simulate>)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const simulates = sdk.appPowerRentalSimulates

const target = ref({} as apppowerrentalsimulate.Simulate)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as apppowerrentalsimulate.Simulate
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: apppowerrentalsimulate.Simulate) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = () => {
  updating.value ? updateAppSimulateGood() : createAppSimulateGood()
}

const onDelete = () => {
  selectedSimulate.value.forEach((simulate) => {
    sdk.adminDeleteAppPowerRentalSimulate(simulate)
  })
}

const createAppSimulateGood = () => {
  sdk.adminCreateAppPowerRentalSimulate(target.value)
  onMenuHide()
}

const updateAppSimulateGood = () => {
  sdk.adminUpdateAppPowerRentalSimulate(target.value)
  onMenuHide()
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!simulates.value.length) {
    sdk.adminGetAppPowerRentalSimulates(0, 0)
  }
}

const appSimulateGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.GoodName
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => row.AppGoodName
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: apppowerrentalsimulate.Simulate) => utils.formatTime(row.UpdatedAt)
  }
])
</script>

<style lang='sass' scoped>
</style>
