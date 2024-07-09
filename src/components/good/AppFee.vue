<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEES")'
    :rows='fees'
    :columns='feeColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
    v-model:selected='selectedFees'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedFees.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_FEES")'
    :rows='appFees'
    :columns='appFeesColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedAppFees'
    @row-click='(ev, row, index) => onRowClick(row as appfee.AppFee)'
  >
    <template #top-right>
      <div>
        <q-btn
          dense
          flat
          class='btn flat'
          :disable='selectedAppFees.length === 0'
          :label='$t("MSG_UNAUTHORIZE")'
          @click='onUnauthorize'
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
        <q-input v-model='target.AppGoodName' :label='$t("MSG_NAME")' />
        <q-input v-model='target.UnitValue' :label='$t("MSG_UNIT_VALUE")' type='number' :min='0' />
        <q-input v-model='target.MinOrderDurationSeconds' :label='$t("MSG_MIN_ORDER_DURATION_SECONDS")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='[goodbase.CancelMode.Uncancellable, goodbase.CancelMode.CancellableBeforeUsed]'
          v-model='target.CancelMode'
          :label='$t("MSG_CANCEL_MODE")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn alt round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { appfee, sdk, goodbase, fee } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goodName = ref('')

const fees = sdk.fees
const selectedFees = ref([] as fee.Fee[])
const selectedFee = computed(() => selectedFees.value[0])

const appFees = sdk.appFees
const selectedAppFees = ref([] as Array<appfee.AppFee>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appfee.AppFee)

watch(selectedFee, () => {
  target.value.GoodID = selectedFee.value?.GoodID
})

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appfee.AppFee
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppFee() : createAppFee()
}

const createAppFee = () => {
  target.value.GoodID = selectedFee.value.GoodID
  sdk.adminCreateAppFee(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateAppFee = () => {
  sdk.adminUpdateAppFee(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appfee.AppFee) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onUnauthorize = () => {
  sdk.adminDeleteAppFee(target.value, () => {
    // NOTHING TODO
  })
}

watch(sdk.AppID, () => {
  if (!appFees.value.length) {
    sdk.adminGetAppFees(0, 0)
  }
  if (!fees.value.length) {
    sdk.getFees(0, 0)
  }
})

onMounted(() => {
  if (!appFees.value.length) {
    sdk.adminGetAppFees(0, 0)
  }
  if (!fees.value.length) {
    sdk.getFees(0, 0)
  }
})

const feeColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.EntID
  },
  {
    name: 'Title',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: fee.Fee) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: fee.Fee) => row.GoodType
  },
  {
    name: 'GoodPrice',
    label: t('MSG_GOOD_UNIT_VALUE'),
    sortable: true,
    field: (row: fee.Fee) => row.UnitValue +
                            (row.SettlementType === goodbase.GoodSettlementType.GoodSettledByPaymentAmount ? ' USDT' : (' % of ' +
                              (row.SettlementType === goodbase.GoodSettlementType.GoodSettledByPaymentPercent ? 'Payment' : 'Reward')))
  }
])

const appFeesColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodType
  }
])

</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
