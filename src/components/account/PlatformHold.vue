<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedCoin'
  />
  <q-table
    dense
    flat
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
          :disable='selectedCoin.length === 0'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { Account, useChurchAccountStore, useCoinStore, NotificationType, Coin } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const account = useChurchAccountStore()
const coin = useCoinStore()

interface MyAccount extends Account {
  CoinName: string
}

const accounts = computed(() => Array.from(account.Accounts.filter((ac) => ac.PlatformHoldPrivateKey)).map((el) => {
  const ac = el as MyAccount
  ac.CoinName = coin.getCoinByID(ac.CoinTypeID)?.Name as string
  return ac
}))

const coins = computed(() => coin.Coins.filter((el) => !el.PreSale))
const selectedCoin = ref([] as Array<Coin>)

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
})

const onCreate = () => {
  account.createPlatformAccount({
    CoinTypeID: selectedCoin.value[0].ID as string,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ACCOUNT',
        Message: 'MSG_CREATE_ACCOUNT_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
