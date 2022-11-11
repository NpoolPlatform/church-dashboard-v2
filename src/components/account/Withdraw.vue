<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS")'
    :rows='withdrawAddress'
    row-key='ID'
    :columns='withdrawColumns'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import {
  Account,
  useChurchUserAccountStore
} from 'npool-cli-v4'
import { getNAppUserAccounts } from 'src/api/account'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchUserAccountStore()
const withdrawAddress = computed(() => account.withdrawAddress(appID.value))

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!account.UserAccounts.UserAccounts.get(appID.value)) {
    getNAppUserAccounts(0, 500)
  }
}

const withdrawColumns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: Account) => row.ID
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Account) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Account) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_DESCRIPTION'),
    field: (row: Account) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: Account) => row.CoinName
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    field: (row: Account) => row.AccountID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: Account) => row.Address
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: Account) => row.UsedFor
  },
  {
    name: 'Labels',
    label: t('MSG_LABELS'),
    field: (row: Account) => row.Labels?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: Account) => row.CreatedAt
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Account) => row.EmailAddress
  },
  {
    name: 'PhoneNo',
    label: t('MSG_PHONE_NO'),
    field: (row: Account) => row.PhoneNO
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    field: (row: Account) => row.Active
  },
  {
    name: 'BLOCKED',
    label: t('MSG_BLOCKED'),
    field: (row: Account) => row.Blocked
  }
])
</script>
