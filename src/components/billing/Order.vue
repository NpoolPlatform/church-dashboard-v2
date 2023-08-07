<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :columns='columns'
    ::rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as Order)'
  >
    <template #top-right>
      <select class='order-type' name='order-type' v-model='selectedOrderType'>
        <option v-for='value in OrderTypes' :key='value'>
          {{ value }}
        </option>
      </select>
      <q-input
        dense
        class='small'
        v-model='goodID'
        :label='$t("MSG_GOOD_ID")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
      />
    </template>
  </q-table>
  <q-item><span>{{ $t('MSG_PAID') }}: {{ soldUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_WAIT_PAYMENT') }}: {{ waitPaymentUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_TIMEOUT') }}: {{ timeoutUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_USER_CANCELED') }}: {{ userCanceledUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_CANCELED') }}: {{ canceledUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_IN_SERVICE') }}: {{ inServiceUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_EXPIRED') }}: {{ expiredUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_WAIT_START') }}: {{ waitStartUnits }}</span></q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_TIMEOUT') }}: {{ paymentTimeouts }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_USDT_AMOUNT') }}: {{ paymentAmount }} {{ PriceCoinName }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_ORDER_USER_COUNT') }}: {{ orderUsers }}</span>
  </q-item>
  <q-dialog
    v-model='orderInfoDialog'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_ORDER_INFO') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_ORDER_ID') }}: {{ currentOrder?.ID }}</q-item-label>
        <q-item-label>{{ $t('MSG_USER_ID') }}: {{ currentOrder?.UserID }}</q-item-label>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ currentOrder?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ currentOrder?.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_COINTYPE_ID') }}: {{ currentOrder?.CoinTypeID }}</q-item-label>
        <q-item-label>{{ $t('MSG_COINNAME') }}: {{ currentOrder?.CoinName }} {{ currentOrder?.Units }}</q-item-label>
        <q-item-label>{{ $t('MSG_UNTITS') }}: {{ currentOrder?.Units }}</q-item-label>
        <q-item-label>{{ $t('MSG_PAYMENT_AMOUNT') }}: {{ currentOrder?.PaymentAmount }}</q-item-label>
        <q-item-label>{{ $t('MSG_CREATED_AT') }}: {{ formatTime(currentOrder?.CreatedAt) }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_GOOD_NAME') }}: {{ currentOrder?.GoodName }}</q-item-label>
        <q-item-label>{{ $t('MSG_PERIOD_DAYS') }}: {{ currentOrder?.GoodServicePeriodDays }}</q-item-label>
        <q-item-label>{{ $t('MSG_ORDER_TYPE') }}: {{ currentOrder?.OrderType }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_ORDER_STATE') }}: {{ currentOrder?.State }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <!-- <q-item-label> <span class='cancel-order-tip' v-if='currentOrder.OrderType !== OrderType.Offline'>Only Paid offline orders can be Canceled!</span></q-item-label> -->
      </q-item>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_CANCEL_ORDER")' @click='cancelOrder' :disable='getTargetAppGood(currentOrder.GoodID)?.CancelMode === CancelMode.UnCancellable' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { PriceCoinName } from 'npool-cli-v2'
import { OrderState, useChurchAppGoodStore, useChurchOrderStore, OrderTypes, Order, NotifyType, formatTime, CancelMode } from 'npool-cli-v4'
import { getAppGoods } from 'src/api/good'
import { getNAppOrders } from 'src/api/order'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const good = useChurchAppGoodStore()
const goods = computed(() => good.getGoodsByAppID(appID.value))
const getTargetAppGood = computed(() => (goodID: string) => goods.value?.find((el) => el.GoodID === goodID))

const goodID = ref('')
const start = ref('')
const end = ref('')
const selectedOrderType = ref('ALL')

const order = useChurchOrderStore()
const orders = computed(() => order.getOrdersByAppID(appID.value))
const displayOrders = computed(() => orders.value.filter((el) => {
  let display = el.GoodID.includes(goodID.value)
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  if (selectedOrderType.value !== 'ALL') {
    display = display && (el.OrderType === selectedOrderType.value)
  }
  return display
}))

const soldUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAID).reduce((sum, b) => sum + Number(b.Units), 0))
const waitPaymentUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.WAIT_PAYMENT).reduce((sum, b) => sum + Number(b.Units), 0))
const timeoutUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAYMENT_TIMEOUT).reduce((sum, b) => sum + Number(b.Units), 0))
const userCanceledUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.USER_CANCELED).reduce((sum, b) => sum + Number(b.Units), 0))
const canceledUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.CANCELED).reduce((sum, b) => sum + Number(b.Units), 0))
const inServiceUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.IN_SERVICE).reduce((sum, b) => sum + Number(b.Units), 0))
const expiredUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.EXPIRED).reduce((sum, b) => sum + Number(b.Units), 0))
const waitStartUnits = computed(() => displayOrders.value.filter((el) => el.State === OrderState.WAIT_START).reduce((sum, b) => sum + Number(b.Units), 0))

const paymentTimeouts = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAYMENT_TIMEOUT).length)
const paymentAmount = computed(() => displayOrders.value.filter((el) => el.State === OrderState.PAID).reduce((sum, b) => {
  const currency = Number(b.PaymentCoinUSDCurrency) > 0 ? Number(b.PaymentCoinUSDCurrency) : 1
  return sum + Number(b.PaymentAmount) * currency + Number(b.PayWithBalanceAmount) * currency
}, 0))

const orderUsers = computed(() => {
  const users = new Map<string, number>()
  displayOrders.value.filter((el) => el.State === OrderState.PAID).forEach((el) => {
    let u = users.get(el.UserID)
    if (!u) {
      u = 0
    }
    u += Number(el.Units)
    users.set(el.UserID, u)
  })
  return users.size
})

const orderInfoDialog = ref(false)
const currentOrder = ref({} as Order)

const onRowClick = (row: Order) => {
  orderInfoDialog.value = true
  currentOrder.value = { ...row }
}

const onMenuHide = () => {
  currentOrder.value = {} as Order
  orderInfoDialog.value = false
}

const onCancel = () => {
  onMenuHide()
}

const cancelOrder = () => {
  orderInfoDialog.value = false
  order.updateAppUserOrder({
    TargetAppID: appID.value,
    ID: currentOrder.value.ID,
    TargetUserID: currentOrder.value.UserID,
    PaymentID: currentOrder.value.PaymentID,
    Canceled: true,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ORDER',
        Message: 'MSG_UPDATE_ORDER_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (goods.value.length === 0) {
    getAppGoods(0, 500)
  }
  if (orders.value.length === 0) {
    getNAppOrders(0, 500)
  }
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: Order) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: Order) => row.AppID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: Order) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: Order) => row.GoodName
  },
  {
    name: 'GoodUnit',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: Order) => row.GoodUnit
  },
  {
    name: 'GoodUnitPrice',
    label: t('MSG_GOOD_UNIT_PRICE'),
    sortable: true,
    field: (row: Order) => row.GoodUnitPrice
  },
  {
    name: 'GoodValue',
    label: t('MSG_GOOD_VALUE'),
    sortable: true,
    field: (row: Order) => row.GoodValue
  },
  {
    name: 'Units',
    label: t('MSG_UNITS'),
    sortable: true,
    field: (row: Order) => row.Units
  },
  {
    name: 'PaymentID',
    label: t('MSG_PAYMENT_ID'),
    sortable: true,
    field: (row: Order) => row.PaymentID
  },
  {
    name: 'PaymentCoinTypeID',
    label: t('MSG_PAYMENT_COINTYPE_ID'),
    sortable: true,
    field: (row: Order) => row.PaymentCoinTypeID
  },
  {
    name: 'PaymentCoinName',
    label: t('MSG_PAYMENT_COINNAME'),
    sortable: true,
    field: (row: Order) => row.PaymentCoinName
  },
  {
    name: 'PaymentCoinUnit',
    label: t('MSG_PAYMENT_COIN_UNIT'),
    sortable: true,
    field: (row: Order) => row.PaymentCoinUnit
  },
  {
    name: 'CoinPresale',
    label: t('MSG_COIN_PRESALE'),
    sortable: true,
    field: (row: Order) => row.CoinPresale
  },
  {
    name: 'PaymentAddress',
    label: t('MSG_PAYMENT_ADDRESS'),
    sortable: true,
    field: (row: Order) => row.PaymentAddress
  },
  {
    name: 'PaymentCoinUSDCurrency',
    label: t('MSG_PAYMENT_COIN_USD_CURRENCY'),
    sortable: true,
    field: (row: Order) => row.PaymentCoinUSDCurrency
  },
  {
    name: 'PaymentLiveUSDCurrency',
    label: t('MSG_PAYMENT_LIVE_USD_CURRENCY'),
    sortable: true,
    field: (row: Order) => row.PaymentLiveUSDCurrency
  },
  {
    name: 'PaymentLocalUSDCurrency',
    label: t('MSG_PAYMENT_LOCAL_USD_CURRENCY'),
    sortable: true,
    field: (row: Order) => row.PaymentLocalUSDCurrency
  },
  {
    name: 'PaymentAmount',
    label: t('MSG_PAYMENT_AMOUNT'),
    sortable: true,
    field: (row: Order) => row.PaymentAmount
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: Order) => row.OrderType
  },
  {
    name: 'State',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: Order) => row.State
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: Order) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: Order) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: Order) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: Order) => formatTime(row.CreatedAt)
  },
  {
    name: 'PaidAt',
    label: t('MSG_PAID_AT'),
    sortable: true,
    field: (row: Order) => formatTime(row.PaidAt)
  },
  {
    name: 'Start',
    label: t('MSG_START'),
    sortable: true,
    field: (row: Order) => formatTime(row.Start)
  },
  {
    name: 'End',
    label: t('MSG_END'),
    sortable: true,
    field: (row: Order) => formatTime(row.End)
  }
])
</script>
<style scoped>
select {
  border: none;
  outline: none
}
.cancel-order-tip {
  color: #34b6e0
}
</style>
