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
    name: 'CoinTypeID',
    label: t('MSG_COINTYPE_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinTypeID
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => utils.formatTime(row.CreatedAt)
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
  }
])

</script>
