<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESSES")'
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    :columns='(columns as never)'
  />
</template>

<script setup lang='ts'>
import { useChurchAccountStore, useCoinStore, NotificationType, WithdrawAddress } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface MyAccount extends WithdrawAddress {
  CoinName: string
  Address: string
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'ID',
    label: t('ID'),
    sortable: true,
    align: 'left',
    field: 'ID'
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    sortable: true,
    align: 'left',
    field: 'AccountID'
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    align: 'left',
    field: 'AppID'
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    align: 'left',
    field: 'UserID'
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    align: 'left',
    field: 'Message'
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    sortable: true,
    field: 'Name'
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    align: 'left',
    sortable: true,
    field: 'CoinName'
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    align: 'left',
    sortable: true,
    field: 'Address'
  },
  {
    name: 'CreateAt',
    label: t('MSG_CREATEDAT'),
    align: 'left',
    sortable: true,
    field: 'CreateAt'
  },
  {
    name: 'DeleteAt',
    label: t('MSG_DELETEAT'),
    align: 'left',
    sortable: true,
    field: 'DeleteAt'
  }
])
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchAccountStore()
const coin = useCoinStore()

const appAccounts = computed(() => {
  return account.WithdrawAddresses.get(appID.value) ? account.WithdrawAddresses.get(appID.value) as Array<WithdrawAddress> : []
})
const accounts = computed(() => Array.from(appAccounts.value).map((el) => {
  const ac = el as MyAccount
  ac.Address = account.getAccountByID(ac.AccountID)?.Address
  ac.CoinName = coin.getCoinByID(account.getAccountByID(ac.AccountID)?.CoinTypeID)?.Name as string
  return ac
}))

watch(appID, () => {
  account.getWithdrawAddresses({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESSES',
        Message: 'MSG_GET_WITHDRAW_ADDRESSES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

onMounted(() => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  account.getAccounts({
    Message: {
      Error: {
        Title: 'MSG_GET_ACCOUNTS',
        Message: 'MSG_GET_ACCOUNTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  account.getWithdrawAddresses({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESSES',
        Message: 'MSG_GET_WITHDRAW_ADDRESSES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
