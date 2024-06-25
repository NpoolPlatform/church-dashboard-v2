<template>
  <Chain />
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[20]'
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
        <CoinPicker v-model:coin-type-id='target.FeeCoinTypeID' label='MSG_FEE_COIN_TYPE_ID' :get-data='false' />
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
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <CoinUsedFor />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { coin, basetypes, chain, sdk } from 'src/npoolstore'

const Chain = defineAsyncComponent(() => import('src/components/coin/Chain.vue'))
const CoinUsedFor = defineAsyncComponent(() => import('src/components/coin/CoinUsedFor.vue'))
const AppCoin = defineAsyncComponent(() => import('src/components/coin/AppCoin.vue'))
const CoinPickerByName = defineAsyncComponent(() => import('src/components/coin/CoinPickerByName.vue'))
const ChainPicker = defineAsyncComponent(() => import('src/components/coin/ChainPicker.vue'))

enum CoinEnvironment {
  Test = 'test',
  Main = 'main'
}

const CoinEnvironments = [
  CoinEnvironment.Main,
  CoinEnvironment.Test
]

const coins = sdk.coins

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => {
    return el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
          el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
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
  submitting.value = false
  target.value = {} as coin.Coin
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateCoin() : createCoin()
}

const createCoin = () => {
  sdk.adminCreateCoin(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateCoin = () => {
  sdk.adminUpdateCoin(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

onMounted(() => {
  if (!coins.value.length) {
    sdk.getCoins(0, 0)
  }
})
</script>
