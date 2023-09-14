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
import { getAppWithdraws } from 'src/api/ledger'
import { AppID } from 'src/api/app'
import { computed, onMounted, watch } from 'vue'
import { formatTime, useChurchLedgerWithdrawStore, Withdraw } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const withdraw = useChurchLedgerWithdrawStore()
const withdraws = computed(() => withdraw.getWithdrawsByAppID(AppID.value))

const prepare = () => {
  getAppWithdraws(0, 500)
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const withdrawColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COINTYPE_ID'),
    sortable: true,
    field: (row: Withdraw) => row.CoinTypeID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: Withdraw) => row.Address
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: Withdraw) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: Withdraw) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: Withdraw) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: Withdraw) => formatTime(row.CreatedAt)
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: Withdraw) => row.Message
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: Withdraw) => row.State
  }
])

</script>
