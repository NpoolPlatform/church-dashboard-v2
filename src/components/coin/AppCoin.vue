<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_APP_COINS")'
    :rows-per-page-options='[10]'
    v-model:selected='selectedCoin'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='(selectedCoin.length === 0)'
          @click='onDelete'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' label='MSG_COIN_TYPE_ID' :get-data='false' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <q-input type='number' v-model='target.WithdrawAutoReviewAmount' :label='$t("MSG_WITHDRAW_AUTO_REVIEW_AMOUNT")' />
        <q-input type='number' v-model='target.MarketValue' :label='$t("MSG_COIN_MARKET_VALUE")' />
        <q-input type='number' v-model.number='target.SettlePercent' :label='$t("MSG_COIN_SETTLE_PERCENT")' />
        <q-input type='number' v-model='target.DailyRewardAmount' :label='$t("MSG_DAILY_REWARD_AMOUNT")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><q-toggle dense v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.ForPay' :label='$t("MSG_FOR_PAY")' /><span class='tip'>CoinForPay: {{ target.CoinForPay }}</span></div>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /><span class='tip'>CoinDisabled: {{ target.CoinDisabled }}</span></div>
        <div><q-toggle dense v-model='target.Display' :label='$t("MSG_DISPLAY")' /></div>
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
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.CoinTypeID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as AppCoin)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

// const onRowClick = (row: AppCoin) => {
//   target.value = { ...row }
//   showing.value = true
//   updating.value = true
// }

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
    SettlePercent: target.value?.SettlePercent === 0 ? undefined as unknown as number : target.value?.SettlePercent,
    ProductPage: target.value?.ProductPage?.length > 0 ? target.value?.ProductPage : undefined as unknown as string,
    DailyRewardAmount: target.value?.DailyRewardAmount?.length > 0 ? target.value?.DailyRewardAmount : undefined as unknown as string,
    Disabled: target?.value?.Disabled,
    Display: target?.value?.Display
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

const selectedCoin = ref([] as Array<AppCoin>)
const onDelete = () => {
  selectedCoin.value.forEach((el) => {
    coin.deleteAppCoin({
      ID: el.ID,
      TargetAppID: el.AppID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_APP_COIN',
          Message: 'MSG_DELETE_COIN_FAIL',
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

watch([() => target.value?.Disabled, () => target.value?.ForPay], () => {
  if (target.value?.CoinDisabled) {
    target.value.Disabled = true
  }
  if (!target.value?.CoinForPay) {
    target.value.ForPay = false
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
