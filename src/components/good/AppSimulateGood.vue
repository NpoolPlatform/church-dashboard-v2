<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_SIMULATE_GOODS")'
    :rows='sdk.simulateGoods.value'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='appSimulateGoodsColumns'
    selection='single'
    v-model:selected='selectedSimulate'
    @row-click='(evt, row, index) => onRowClick(row as appsimulategood.Simulate)'
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
        <AppGoodSelector v-model:id='target.AppGoodID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.FixedOrderUnits' :label='$t("MSG_FIXED_ORDER_UNITS")' />
        <q-input v-model='target.FixedOrderDuration' :label='$t("MSG_FIXED_ORDER_DURATION")' />
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
import { appsimulategood, notify, utils, sdk } from 'src/npoolstore'

const selectedSimulate = ref([] as Array<appsimulategood.Simulate>)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const simulategood = appsimulategood.useAppSimulateGoodStore()

const target = ref({} as appsimulategood.Simulate)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as appsimulategood.Simulate
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appsimulategood.Simulate) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppSimulateGood(done) : createAppSimulateGood(done)
}

const onDelete = () => {
  if (selectedSimulate.value.length === 0) {
    return
  }

  simulategood.deleteNAppSimulateGood({
    TargetAppID: AppID.value,
    ID: selectedSimulate.value[0].ID,
    EntID: selectedSimulate.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_SIMULATE_GOOD',
        Message: 'MSG_DELETE_APP_SIMULATE_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_SIMULATE_GOOD',
        Message: 'MSG_DELETE_APP_SIMULATE_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const createAppSimulateGood = (done: () => void) => {
  done()
  sdk.createNSimulateGood(target.value)
  onMenuHide()
}

const updateAppSimulateGood = (done: () => void) => {
  done()
  sdk.updateNSimulateGood(target.value)
  onMenuHide()
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!sdk.simulateGoods.value.length) {
    sdk.getNSimulateGoods(0, 0)
  }
}

const appSimulateGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.GoodName
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.AppGoodName
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.CoinTypeID
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.CoinUnit
  },
  {
    name: 'FixedOrderUnits',
    label: t('MSG_FIXED_ORDER_UNITS'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.FixedOrderUnits
  },
  {
    name: 'FixedOrderDuration',
    label: t('MSG_FIXED_ORDER_DURATION'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => row.FixedOrderDuration
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: appsimulategood.Simulate) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
<style lang='sass' scoped>
</style>
