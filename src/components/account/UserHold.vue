<template>
  <q-table
    dense
    flat
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Account)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
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
        <span>{{ $t('MSG_CREATE_APPLICATION') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
        <q-input v-model='target.Address' :label='$t("MSG_ADDRESS")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { Account, useChurchAccountStore, useCoinStore, NotificationType, Coin } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const account = useChurchAccountStore()
const coin = useCoinStore()

interface MyAccount extends Account {
  CoinName: string
}

const accounts = computed(() => Array.from(account.Accounts.filter((ac) => !ac.PlatformHoldPrivateKey)).map((el) => {
  const ac = el as MyAccount
  ac.CoinName = coin.getCoinByID(ac.CoinTypeID)?.Name as string
  return ac
}))

interface MyCoin {
  label: string
  value: Coin
}

const coins = computed(() => Array.from(coin.Coins).map((el) => {
  return {
    label: el.Name,
    value: el
  } as MyCoin
}))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Account)

const selectedCoin = computed({
  get: () => {
    const myCoin = coin.getCoinByID(target.value.CoinTypeID)
    if (!myCoin) {
      return undefined as unknown as MyCoin
    }
    return {
      label: myCoin.Name,
      value: myCoin
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinTypeID = val.value.ID as string
  }
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
})

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Account
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (account: Account) => {
  target.value = account
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  if (!selectedCoin.value) {
    return
  }

  if (updating.value) {
    // TODO
    return
  }

  account.createUserAccount({
    Info: target.value,
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

const onCancel = () => {
  onMenuHide()
}

</script>
