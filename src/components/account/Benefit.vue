<template>
  <q-table
    dense
    flat
    :rows='benefits'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as GoodBenefit)'
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
        <q-select :options='accounts' v-model='selectedAccount' :label='$t("MSG_ACCOUNT")' />
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
        <q-input
          type='number'
          min='1'
          max='24'
          v-model='target.BenefitIntervalHours'
          :label='$t("MSG_ADDRESS")'
          :suffix='$t("MSG_HOUR")'
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
  GoodBenefit,
  useGoodSettingStore,
  useAdminGoodStore,
  GoodBase,
  useCoinSettingStore,
  WithdrawAddress
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchAccountStore()
const coin = useCoinStore()
const setting = useGoodSettingStore()
const good = useAdminGoodStore()
const csetting = useCoinSettingStore()

interface MyBenefit extends GoodBenefit {
  CoinName: string
  GoodName: string
  Address: string
}

const benefits = computed(() => Array.from(setting.GoodBenefits).map((el) => {
  const gb = el as MyBenefit
  const ac = account.getAccountByID(gb.BenefitAccountID)
  gb.CoinName = coin.getCoinByID(ac?.CoinTypeID)?.Name as string
  gb.Address = ac?.Address
  gb.GoodName = good.getGoodByID(gb.GoodID)?.Good.Good.Title
  return gb
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
const selectedCoin = ref(undefined as unknown as MyCoin)

interface MyAccount {
  label: string
  value: Account
}

const accounts = computed(() => account.Accounts.filter((el) => {
  let index = csetting.CoinSettings.findIndex((cs) => {
    return cs.PlatformOfflineAccountID === el.ID ||
           cs.UserOfflineAccountID === el.ID ||
           cs.UserOnlineAccountID === el.ID ||
           cs.GoodIncomingAccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  index = benefits.value.findIndex((gs) => {
    return gs.BenefitAccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  index = account.GoodPayments.findIndex((gp) => {
    return gp.AccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  const addresses = account.WithdrawAddresses.get(appID.value) ? account.WithdrawAddresses.get(appID.value) as Array<WithdrawAddress> : []
  index = addresses.findIndex((wa) => {
    return wa.AccountID === el.ID
  })
  if (index >= 0) {
    return false
  }
  return el.CoinTypeID === selectedCoin.value?.value.ID && el.PlatformHoldPrivateKey
}).map((el) => {
  return {
    label: selectedCoin.value?.value.Name as string + ' | ' + el.Address,
    value: el
  } as MyAccount
}))
const selectedAccount = computed({
  get: () => {
    const ac = account.getAccountByID(target.value.BenefitAccountID)
    if (!ac) {
      return undefined as unknown as MyAccount
    }
    const cc = coin.getCoinByID(ac?.CoinTypeID)
    return {
      label: cc?.Name as string + ' | ' + ac?.Address,
      value: ac
    } as MyAccount
  },
  set: (val) => {
    target.value.BenefitAccountID = val.value.ID as string
  }
})

interface MyGood {
  label: string
  value: GoodBase
}

const goods = computed(() => Array.from(good.Goods.filter((g) => {
  return g.Main?.ID === selectedCoin.value?.value.ID
})).map((el) => {
  return {
    label: el.Good.Good.Title,
    value: el.Good.Good
  } as MyGood
}))
const selectedGood = computed({
  get: () => {
    return {
      label: good.getGoodByID(target.value.GoodID)?.Good.Good.Title,
      value: good.getGoodByID(target.value.GoodID)?.Good.Good
    } as MyGood
  },
  set: (val) => {
    target.value.GoodID = val.value.ID as string
  }
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as GoodBenefit)

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

  setting.getGoodBenefits({
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

  csetting.getGCoinSettings({
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

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as GoodBenefit
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (acc: GoodBenefit) => {
  target.value = acc
  showing.value = true
  updating.value = true
  const ac = account.getAccountByID(target.value.BenefitAccountID)
  selectedCoin.value = {
    label: coin.getCoinByID(ac.CoinTypeID).Name as string,
    value: coin.getCoinByID(ac.CoinTypeID)
  }
}

const onSubmit = () => {
  showing.value = false

  if (!selectedCoin.value) {
    return
  }

  if (updating.value) {
    setting.updateGoodBenefit({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_GOOD_BENEFIT',
          Message: 'MSG_UPDATE_GOOD_BENEFIT_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  setting.createGoodBenefit({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_GOOD_BENEFIT',
        Message: 'MSG_CREATE_GOOD_BENEFIT_FAIL',
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
