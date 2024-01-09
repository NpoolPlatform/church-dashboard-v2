<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CASH_CONTROL")'
    :rows='displayCashControls'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedCashControls'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='selectedCashControls?.length === 0'
        @click='onDelete'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CASH_CONTROL') }}</span>
      </q-card-section>
      <q-card-section>
        <CouponSelector v-model:id='target.CouponID' />
      </q-card-section>
      <q-card-section>
        <q-select :options='ControlTypes' v-model='target.ControlType' :label='$t("MSG_ACCOUNT_USED_FOR")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Value' :label='$t("MSG_VALUE")' />
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
import { cashcontrol, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
import { ControlTypes } from 'src/npoolstore/inspire/coupon'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
import { AppID } from 'src/npoolstore/sdk'

const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _cashcontrol = cashcontrol.useCashControlStore()
const username = ref('')
const cashcontrols = computed(() => _cashcontrol.cashcontrols())
const displayCashControls = computed(() => _cashcontrol.cashcontrols().filter((el) => {
  return el.CouponID?.includes(username.value) ||
               el.CouponName?.includes(username.value)
}))

const target = ref({} as cashcontrol.CashControl)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as cashcontrol.CashControl
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as cashcontrol.CashControl
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  sdk.createCashControl(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedCashControls = ref([] as Array<cashcontrol.CashControl>)
const onDelete = () => {
  sdk.deleteCashControl(selectedCashControls.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!cashcontrols.value?.length) {
    sdk.getCashControls(0, 0)
  }
})

onMounted(() => {
  if (!cashcontrols.value?.length) {
    sdk.getCashControls(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.AppID
  },
  {
    name: 'ControlType',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.ControlType
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponName
  },
  {
    name: 'CouponType',
    label: t('MSG_COUPON_TYPE'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponType
  },
  {
    name: 'CouponDenomination',
    label: t('MSG_DENOMINATION'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponDenomination
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => utils.formatTime(row.UpdatedAt)
  }
])

</script>
