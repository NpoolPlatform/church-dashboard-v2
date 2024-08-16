<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_WITHDRAWS")'
    :rows='withdraws'
    row-key='ID'
    :columns='withdrawColumns'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ledgerwithdraw, utils, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const withdraw = ledgerwithdraw.useWithdrawStore()
const withdraws = computed(() => withdraw.withdraws())

const prepare = () => {
  sdk.adminGetLedgerWithdrawes(0, 0)
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const withdrawColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COINTYPE_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinTypeID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Address
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinUnit
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.State
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Amount
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Message
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinLogo
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => utils.formatTime(row.CreatedAt)
  }
])

</script>
