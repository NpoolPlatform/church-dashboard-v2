<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESSES")'
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useChurchAccountStore, useCoinStore, NotificationType, WithdrawAddress } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchAccountStore()
const coin = useCoinStore()

interface MyAccount extends WithdrawAddress {
  CoinName: string
  Address: string
}

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
