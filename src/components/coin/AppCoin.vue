<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_APP_COINS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as AppCoin)'
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
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <!-- <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' /> -->
        <!-- <q-input type='number' v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' /> -->
        <q-input type='number' v-model='target.WithdrawAutoReviewAmount' :label='$t("MSG_WITHDRAW_AUTO_REVIEW_AMOUNT")' />
        <q-input type='number' v-model='target.MarketValue' :label='$t("MSG_COIN_MARKET_VALUE")' />
        <q-input type='number' v-model.number='target.SettlePercent' :label='$t("MSG_COIN_SETTLE_PERCENT")' />
        <!-- <q-select dense :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENVIRONMENT")' /> -->
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><q-toggle dense v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.CoinForPay' :label='$t("MSG_COIN_FOR_PAY")' /><span class='tip'>ForPay: {{ target.ForPay }}</span></div>
        <div><q-toggle dense v-model='target.CoinDisabled' :label='$t("MSG_COIN_DISABLE")' /><span class='tip'>Disabled: {{ target.Disabled }}</span></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useChurchAppCoinStore, NotifyType, AppCoin } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { getAppCoins } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coin = useChurchAppCoinStore()
const coins = computed(() => coin.getCoinsByAppID(appID.value))

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as AppCoin)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: AppCoin) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as AppCoin
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppCoin(done) : createAppCoin(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value?.ID,
    AppID: target.value?.AppID,
    CoinTypeID: target.value?.CoinTypeID,
    Name: target.value?.Name,
    Logo: target.value?.Logo,
    ForPay: target.value?.ForPay,
    WithdrawAutoReviewAmount: target.value?.WithdrawAutoReviewAmount,
    MarketValue: target.value?.MarketValue,
    SettlePercent: target.value?.SettlePercent,
    ProductPage: target.value?.ProductPage
  }
})

const updateAppCoin = (done: () => void) => {
  coin.updateAppCoin({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_COIN',
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

const createAppCoin = (done: () => void) => {
  coin.createAppCoin({
    TargetAppID: appID.value,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_COIN',
        Message: 'MSG_CREATE_APP_COIN_FAIL',
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

watch([() => target.value?.CoinDisabled, () => target.value?.CoinForPay], () => {
  if (target.value?.Disabled) {
    target.value.CoinDisabled = true
  }
  if (!target.value?.ForPay) {
    target.value.CoinForPay = false
  }
})

watch(appID, () => {
  if (coins.value?.length === 0) {
    getAppCoins(0, 500)
  }
})

onMounted(() => {
  if (coins.value?.length === 0) {
    getAppCoins(0, 500)
  }
})
</script>
