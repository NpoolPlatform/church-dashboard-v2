<template>
  <q-table
    dense
    flat
    :rows='coins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Coin)'
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
        <span>{{ $t('MSG_CREATE_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input type='number' v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' />
        <q-input v-model='target.Unit' :label='$t("MSG_COIN_UNIT")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.ForPay' :label='$t("MSG_COIN_FOR_PAY")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Presale' :label='$t("MSG_COIN_PRESALE")' />
        </div>
        <q-select dense :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENVIRONMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { CoinEnvironments } from 'npool-cli-v2'
import { useChurchCoinStore, Coin, NotifyType } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref } from 'vue'

const coin = useChurchCoinStore()
const coins = computed(() => coin.Coins.Coins)

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Coin)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Coin
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: Coin) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
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
    HomePage: target.value.HomePage,
    Specs: target.value.Specs,
    FeeCoinTypeID: target.value.FeeCoinTypeID,
    WithdrawFeeByStableUSD: target.value.WithdrawFeeByStableUSD,
    WithdrawFeeAmount: target.value.WithdrawFeeAmount,
    CollectFeeAmount: target.value.CollectFeeAmount,
    HotWalletAccountAmount: target.value.HotWalletAccountAmount,
    LowFeeAmount: target.value.LowFeeAmount,
    HotWalletFeeAmount: target.value.HotWalletAccountAmount,
    PaymentAccountCollectAmount: target.value.PaymentAccountCollectAmount
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

const createCoin = (done: () => void) => {
  coin.createCoin({
    Logo: target.value.Logo,
    ForPay: target.value.ForPay,
    Name: target.value.Name,
    AppID: '',
    UserID: '',
    CoinTypeID: '',
    ID: '',
    WithdrawAutoReviewAmount: '',
    MarketValue: '',
    SettlePercent: 0,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN',
        Message: 'MSG_CREATE_COIN_FAIL',
        Popup: true,
        Type: NotifyType.Error
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
  getCoins(0, 500)
})
</script>
