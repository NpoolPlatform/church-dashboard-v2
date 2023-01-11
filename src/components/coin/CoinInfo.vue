<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Coin)'
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
      <q-card-section>
        <CoinPicker v-model:id='target.FeeCoinTypeID' label='MSG_FEE_COIN_TYPE_ID' :get-data='false' />
        <q-input v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.WithdrawFeeAmount' :label='$t("MSG_WITHDRAW_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.CollectFeeAmount' :label='$t("MSG_COLLECT_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.LowFeeAmount' :label='$t("MSG_LOW_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.HotWalletFeeAmount' :label='$t("MSG_HOT_WALLET_FEE_AMOUNT")' />
        <q-input type='number' v-model='target.HotWalletAccountAmount' :label='$t("MSG_HOT_WALLET_ACCOUNT_AMOUNT")' />
        <q-input type='number' v-model='target.PaymentAccountCollectAmount' :label='$t("MSG_PAYMENT_ACCOUNT_COLLECT_AMOUNT")' />
        <q-input type='number' v-model='target.LeastTransferAmount' :label='$t("MSG_LEAST_TRANSFER_AMOUNT")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.WithdrawFeeByStableUSD' :label='$t("MSG_WITHDRAW_FEE_BY_STABLE_USD")' /></div>
        <div><q-toggle dense v-model='target.ForPay' :label='$t("MSG_FOR_PAY")' /></div>
        <div><q-toggle dense v-model='target.Presale' :label='$t("MSG_PRESALE")' /></div>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLED")' /></div>
        <div><q-toggle dense v-model='target.StableUSD' :label='$t("MSG_STABLEUSD")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useChurchCoinStore, Coin, NotifyType } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const AppCoin = defineAsyncComponent(() => import('src/components/coin/AppCoin.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coin = useChurchCoinStore()
const coins = computed(() => coin.Coins.Coins)

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Coin)

const onRowClick = (row: Coin) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Coin
}

const onSubmit = (done: () => void) => {
  updateCoin(done)
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
    HotWalletFeeAmount: target.value.HotWalletFeeAmount,
    PaymentAccountCollectAmount: target.value.PaymentAccountCollectAmount,
    LeastTransferAmount: target.value.LeastTransferAmount,
    StableUSD: target.value?.StableUSD,
    Disabled: target.value?.Disabled
  }
})
const updateCoin = (done: () => void) => {
  coin.updateCoin({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
        Popup: true,
        Type: NotifyType.Success
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
  if (coin.Coins.Coins.length === 0) {
    getCoins(0, 500)
  }
})
</script>
