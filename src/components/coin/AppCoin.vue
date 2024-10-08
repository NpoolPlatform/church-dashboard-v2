<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_APP_COINS")'
    :rows-per-page-options='[20]'
    v-model:selected='selectedCoin'
    :columns='coinColumns'
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
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' :updating='updating' label='MSG_COIN_TYPE_ID' :get-data='false' />
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
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { appcoin, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coins = sdk.appCoin.appCoins

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => {
    return el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
      el.CoinName?.toLowerCase()?.includes(name.value?.toLowerCase()) ||
      el.CoinTypeID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as appcoin.AppCoin)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as appcoin.AppCoin
}

const onSubmit = () => {
  updating.value ? updateAppCoin() : createAppCoin()
}

const updateAppCoin = () => {
  // TODO
}

const createAppCoin = () => {
  sdk.appCoin.adminCreateAppCoin(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const selectedCoin = ref([] as Array<appcoin.AppCoin>)
const onDelete = () => {
  selectedCoin.value.forEach((el) => {
    sdk.appCoin.adminDeleteAppCoin(el)
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

watch(AppID, () => {
  if (coins.value?.length === 0) {
    sdk.appCoin.adminGetAppCoins(0, 0)
  }
})

onMounted(() => {
  if (coins.value?.length === 0) {
    sdk.appCoin.adminGetAppCoins(0, 0)
  }
})

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.AppID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.CoinTypeID
  },
  {
    name: 'Name',
    label: t('MSG_APP_COIN_NAME'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.CoinName
  },
  {
    name: 'DisplayNames',
    label: t('MSG_DISPLAY_NAME'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DisplayNames.join(',')
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Logo
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Unit
  },
  {
    name: 'Presale',
    label: t('MSG_PRESALE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Presale
  },
  {
    name: 'ReservedAmount',
    label: t('MSG_RESERVED_AMOUNT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ReservedAmount
  },
  {
    name: 'ForPay',
    label: t('MSG_FOR_PAY'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ForPay
  },
  {
    name: 'ProductPage',
    label: t('MSG_PRODUCT_PAGE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ProductPage
  },
  {
    name: 'ENV',
    label: t('MSG_ENV'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ENV
  },
  {
    name: 'MarketValue',
    label: t('MSG_MARKET_VALUE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.MarketValue
  },
  {
    name: 'SettleValue',
    label: t('MSG_SETTLE_VALUE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettleValue
  },
  {
    name: 'SettlePercent',
    label: t('MSG_SETTLE_PERCENT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettlePercent
  },
  {
    name: 'SettleTips',
    label: t('MSG_SETTLE_TIPS'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettleTips.join(',')
  },
  {
    name: 'DailyRewardAmount',
    label: t('MSG_DAILY_REWARD_AMOUNT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DailyRewardAmount
  },
  {
    name: 'Display',
    label: t('MSG_DISPLAY'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Display
  },
  {
    name: 'DisplayIndex',
    label: t('MSG_DISPLAY_INDEX'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DisplayIndex
  }
])
</script>
