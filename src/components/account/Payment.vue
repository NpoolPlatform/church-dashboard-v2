<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENT_ADDRESSES")'
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useChurchAccountStore, useCoinStore, NotificationType, GoodPayment } from 'npool-cli-v2'
import { computed, onMounted } from 'vue'

const account = useChurchAccountStore()
const coin = useCoinStore()

interface MyAccount extends GoodPayment {
  CoinName: string
  Address: string
}

const accounts = computed(() => Array.from(account.GoodPayments).map((el) => {
  const ac = el as MyAccount
  ac.Address = account.getAccountByID(ac.AccountID)?.Address
  ac.CoinName = coin.getCoinByID(account.getAccountByID(ac.AccountID)?.CoinTypeID)?.Name as string
  return ac
}))

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

  account.getGoodPayments({
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_PAYMENTS',
        Message: 'MSG_GET_GOOD_PAYMENTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
