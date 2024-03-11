<template>
  <Chain />
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as coin.Coin)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_COINNAME")'
        />
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
  <AppCoin />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section v-if='updating'>
        <CoinPicker v-model:id='target.FeeCoinTypeID' label='MSG_FEE_COIN_TYPE_ID' :get-data='false' />
        <q-input v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <q-input type='number' v-model='target.WithdrawFeeAmount' :label='$t("MSG_WITHDRAW_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.CollectFeeAmount' :label='$t("MSG_COLLECT_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.LowFeeAmount' :label='$t("MSG_LOW_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.HotLowFeeAmount' :label='$t("MSG_HOT_LOW_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.HotWalletFeeAmount' :label='$t("MSG_HOT_WALLET_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.HotWalletAccountAmount' :label='$t("MSG_HOT_WALLET_ACCOUNT_AMOUNT")' />
        <q-input type='number' v-model='target.PaymentAccountCollectAmount' :label='$t("MSG_PAYMENT_ACCOUNT_COLLECT_AMOUNT")' />
        <q-input type='number' v-model='target.LeastTransferAmount' :label='$t("MSG_LEAST_TRANSFER_AMOUNT")' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input v-model='target.Unit' :label='$t("MSG_COIN_UNIT")' />
        <q-select :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENV")' />
        <ChainPicker v-model:id='target.ChainID' />
        <q-input v-model='target.ChainNickname' :label='$t("MSG_CHAIN_NICK_NAME")' />
        <q-input v-model='target.ChainType' :label='$t("MSG_CHAIN_TYPE")' />
        <q-input v-model='target.ChainNativeUnit' :label='$t("MSG_CHAIN_NATIVE_UNIT")' />
        <q-input v-model='target.ChainUnitExp' :label='$t("MSG_CHAIN_UNIT_EXP")' />
        <CoinPickerByName v-model:name='target.ChainNativeCoinName' label='MSG_CHAIN_NATIVE_COIN_NAME' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-select dense :options='basetypes.GasTypes' v-model='target.GasType' :label='$t("MSG_GAS_TYPE")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><q-toggle dense v-model='target.NeedMemo' :label='$t("MSG_MEMO")' /></div>
        <div><q-toggle dense v-model='target.WithdrawFeeByStableUSD' :label='$t("MSG_WITHDRAW_FEE_BY_STABLE_USD")' /></div>
        <div><q-toggle dense v-model='target.ForPay' :label='$t("MSG_FOR_PAY")' /></div>
        <div><q-toggle dense v-model='target.Presale' :label='$t("MSG_PRESALE")' /></div>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLED")' /></div>
        <div><q-toggle dense v-model='target.StableUSD' :label='$t("MSG_STABLEUSD")' /></div>
        <div><q-toggle dense v-model='target.CheckNewAddressBalance' :label='$t("MSG_CHECK_NEW_ADDRESS_BALANCE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <CoinUsedFor />
</template>

<script setup lang='ts'>
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { coin, notify, basetypes, chain } from 'src/npoolstore'

const Chain = defineAsyncComponent(() => import('src/components/coin/Chain.vue'))
const CoinUsedFor = defineAsyncComponent(() => import('src/components/coin/CoinUsedFor.vue'))
const AppCoin = defineAsyncComponent(() => import('src/components/coin/AppCoin.vue'))
const CoinPickerByName = defineAsyncComponent(() => import('src/components/coin/CoinPickerByName.vue'))
const ChainPicker = defineAsyncComponent(() => import('src/components/coin/ChainPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

enum CoinEnvironment {
  Test = 'test',
  Main = 'main'
}

const CoinEnvironments = [
  CoinEnvironment.Main,
  CoinEnvironment.Test
]

const _coin = coin.useCoinStore()
const coins = computed(() => _coin.coins())

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => {
    return el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
          el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as coin.Coin)

const _chain = chain.useChainStore()
const targetChain = computed(() => _chain.getChainByChainID(target.value?.ChainID))

watch(() => target.value.ChainID, () => {
  target.value.ChainType = targetChain.value?.ChainType as string
  target.value.ChainNativeUnit = targetChain.value?.NativeUnit as string
  target.value.ChainAtomicUnit = targetChain.value?.AtomicUnit as string
  target.value.ChainUnitExp = targetChain.value?.UnitExp as number
  target.value.GasType = targetChain.value?.GasType as basetypes.GasType
  target.value.ChainNickname = targetChain.value?.Nickname as string
})

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: coin.Coin) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as coin.Coin
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCoin(done) : createCoin(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Presale: target.value.Presale,
    ReservedAmount: target.value.ReservedAmount,
    ForPay: target.value.ForPay,
    HomePage: target.value.HomePage?.length > 0 ? target.value.HomePage : undefined as unknown as string,
    Specs: target.value.Specs?.length > 0 ? target.value.Specs : undefined as unknown as string,
    FeeCoinTypeID: target.value.FeeCoinTypeID,
    WithdrawFeeByStableUSD: target.value.WithdrawFeeByStableUSD,
    WithdrawFeeAmount: target.value.WithdrawFeeAmount,
    CollectFeeAmount: target.value.CollectFeeAmount,
    HotWalletAccountAmount: target.value.HotWalletAccountAmount,
    LowFeeAmount: target.value.LowFeeAmount,
    HotLowFeeAmount: target.value.HotLowFeeAmount,
    HotWalletFeeAmount: target.value.HotWalletFeeAmount,
    PaymentAccountCollectAmount: target.value.PaymentAccountCollectAmount,
    LeastTransferAmount: target.value.LeastTransferAmount,
    StableUSD: target.value?.StableUSD,
    Disabled: target.value?.Disabled,
    NeedMemo: target.value?.NeedMemo,
    CheckNewAddressBalance: target.value?.CheckNewAddressBalance
  }
})

const createCoin = (done: () => void) => {
  _coin.createCoin({
    ...target.value,
    ChainUnitExp: target.value?.ChainUnitExp,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN',
        Message: 'MSG_CREATE_COIN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_COIN',
        Message: 'MSG_CREATE_COIN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateCoin = (done: () => void) => {
  _coin.updateCoin({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (!coins.value.length) {
    getCoins(0, 100)
  }
})
</script>
