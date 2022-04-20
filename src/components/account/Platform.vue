<template>
  <q-table
    dense
    flat
    :rows='settings'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as CoinSetting)'
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
        <q-select :options='accounts' v-model='selectedIncomingAccount' :label='$t("MSG_GOOD_INCOMING_ACCOUNT")' />
        <q-select :options='accounts' v-model='selectedPlatformOfflineAccount' :label='$t("MSG_PLATFORM_OFFLINE_ACCOUNT")' />
        <q-select :options='accounts' v-model='selectedUserOfflineAccount' :label='$t("MSG_USER_OFFLINE_ACCOUNT")' />
        <q-select :options='accounts' v-model='selectedUserOnlineAccount' :label='$t("MSG_USER_ONLINE_ACCOUNT")' />
        <q-input
          type='number'
          v-model='target.WarmAccountCoinAmount'
          :label='$t("MSG_WARM_ACCOUNT_COIN_AMOUNT")'
          :suffix='selectedCoin?.value?.Unit'
        />
        <q-input
          type='number'
          v-model='target.PaymentAccountCoinAmount'
          :label='$t("MSG_PAYMENT_ACCOUNT_COIN_AMOUNT")'
          :suffix='selectedCoin?.value?.Unit'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  Account,
  useChurchAccountStore,
  useCoinStore,
  NotificationType,
  Coin,
  useAdminGoodStore,
  useCoinSettingStore,
  CoinSetting,
  useGoodSettingStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const account = useChurchAccountStore()
const coin = useCoinStore()
const setting = useCoinSettingStore()
const good = useAdminGoodStore()
const gsetting = useGoodSettingStore()

interface MySetting extends CoinSetting {
  CoinName: string
  GoodIncomingAddress: string
  PlatformOfflineAddress: string
  UserOfflineAddress: string
  UserOnlineAddress: string
}

const settings = computed(() => Array.from(setting.CoinSettings).map((el) => {
  const cs = el as MySetting
  cs.CoinName = coin.getCoinByID(cs.CoinTypeID)?.Name as string
  cs.GoodIncomingAddress = account.getAccountByID(cs.GoodIncomingAccountID as string)?.Address
  cs.PlatformOfflineAddress = account.getAccountByID(cs.PlatformOfflineAccountID as string).Address
  cs.UserOfflineAddress = account.getAccountByID(cs.UserOfflineAccountID as string).Address
  cs.UserOnlineAddress = account.getAccountByID(cs.UserOnlineAccountID as string).Address
  return cs
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
const selectedCoin = computed({
  get: () => {
    return {
      label: coin.getCoinByID(target.value.CoinTypeID)?.Name,
      value: coin.getCoinByID(target.value.CoinTypeID)
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinTypeID = val.value.ID as string
  }
})

interface MyAccount {
  label: string
  value: Account
}

const accounts = computed(() => account.Accounts.filter((el) => {
  let index = settings.value.findIndex((cs) => {
    return cs.PlatformOfflineAccountID === el.ID ||
           cs.UserOfflineAccountID === el.ID ||
           cs.UserOnlineAccountID === el.ID ||
           cs.GoodIncomingAccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  index = gsetting.GoodBenefits.findIndex((gs) => {
    return gs.BenefitAccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  return el.CoinTypeID === selectedCoin.value?.value?.ID && el.PlatformHoldPrivateKey
}).map((el) => {
  return {
    label: selectedCoin.value?.value?.Name as string + ' | ' + el.Address,
    value: el
  } as MyAccount
}))

const constructAccount = (id: string): MyAccount => {
  const ac = account.getAccountByID(id)
  if (!ac) {
    return undefined as unknown as MyAccount
  }
  const cc = coin.getCoinByID(ac?.CoinTypeID)
  return {
    label: cc?.Name as string + ' | ' + ac?.Address,
    value: ac
  } as MyAccount
}

const selectedIncomingAccount = computed({
  get: () => constructAccount(target.value.GoodIncomingAccountID as string),
  set: (val) => {
    target.value.GoodIncomingAccountID = val.value.ID as string
  }
})
const selectedPlatformOfflineAccount = computed({
  get: () => constructAccount(target.value.PlatformOfflineAccountID as string),
  set: (val) => {
    target.value.PlatformOfflineAccountID = val.value.ID as string
  }
})
const selectedUserOfflineAccount = computed({
  get: () => constructAccount(target.value.UserOfflineAccountID as string),
  set: (val) => {
    target.value.UserOfflineAccountID = val.value.ID as string
  }
})
const selectedUserOnlineAccount = computed({
  get: () => constructAccount(target.value.UserOnlineAccountID as string),
  set: (val) => {
    target.value.UserOnlineAccountID = val.value.ID as string
  }
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as CoinSetting)

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

  setting.getGCoinSettings({
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_SETTINGS',
        Message: 'MSG_GET_COIN_SETTINGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  gsetting.getGoodBenefits({
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_BENEFITS',
        Message: 'MSG_GET_GOOD_BENEFITS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  good.getAllGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_GOODS',
        Message: 'MSG_GET_GOODS_FAIL',
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
  target.value = {} as unknown as CoinSetting
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (acc: CoinSetting) => {
  target.value = acc
  showing.value = true
  updating.value = true
}

const onSubmit = () => {
  showing.value = false

  if (!selectedCoin.value) {
    return
  }

  if (updating.value) {
    setting.updateCoinSetting({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_COIN_SETTING',
          Message: 'MSG_UPDATE_COIN_SETTING_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  setting.createCoinSetting({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_SETTING',
        Message: 'MSG_CREATE_COIN_SETTING_FAIL',
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
