<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[constant.DefaultPageSize]'
    @row-click='(evt, row, index) => onRowClick(row as order.Order)'
    :loading='loading'
  >
    <template #top-right>
      <select class='order-type' name='order-type' v-model='selectedOrderType'>
        <option v-for='value in order.OrderTypes' :key='value'>
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
  <q-item><span>{{ $t('MSG_CANCELED') }}: {{ canceledUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_IN_SERVICE') }}: {{ inServiceUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_EXPIRED') }}: {{ expiredUnits }}</span></q-item>
  <q-item><span>{{ $t('MSG_WAIT_START') }}: {{ waitStartUnits }}</span></q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_TIMEOUT') }}: {{ paymentTimeouts }}</span>
  </q-item>
  <q-item>
    <span>{{ $t('MSG_PAYMENT_USDT_AMOUNT') }}: {{ paymentAmount }} {{ constant.PriceCoinName }}</span>
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
        <q-item-label>{{ $t('MSG_CREATED_AT') }}: {{ utils.formatTime(currentOrder?.CreatedAt) }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_GOOD_NAME') }}: {{ currentOrder?.GoodName }}</q-item-label>
        <q-item-label>{{ $t('MSG_PERIOD_DAYS') }}: {{ currentOrder?.GoodServicePeriodDays }}</q-item-label>
        <q-item-label>{{ $t('MSG_ORDER_TYPE') }}: {{ currentOrder?.OrderType }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_ORDER_STATE') }}: {{ currentOrder?.OrderState }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <!-- <q-item-label> <span class='cancel-order-tip' v-if='currentOrder.OrderType !== OrderType.Offline'>Only Paid offline orders can be Canceled!</span></q-item-label> -->
      </q-item>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_CANCEL_ORDER")' @click='cancelOrder' :disable='sdk.appGoodCancelable(currentOrder.GoodID)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, constant, sdk, order } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goodID = ref('')
const start = ref('')
const end = ref('')
const selectedOrderType = ref('ALL')

const displayOrders = computed(() => sdk.orders.value.filter((el) => {
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

const soldUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.PAID).reduce((sum, b) => sum + Number(b.Units), 0))
const waitPaymentUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.WAIT_PAYMENT).reduce((sum, b) => sum + Number(b.Units), 0))
const timeoutUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.PAYMENT_TIMEOUT).reduce((sum, b) => sum + Number(b.Units), 0))
const canceledUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.CANCELED).reduce((sum, b) => sum + Number(b.Units), 0))
const inServiceUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.IN_SERVICE).reduce((sum, b) => sum + Number(b.Units), 0))
const expiredUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.EXPIRED).reduce((sum, b) => sum + Number(b.Units), 0))
const waitStartUnits = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.WAIT_START).reduce((sum, b) => sum + Number(b.Units), 0))

const paymentTimeouts = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.PAYMENT_TIMEOUT).length)
const paymentAmount = computed(() => displayOrders.value.filter((el) => el.OrderState === order.OrderState.PAID).reduce((sum, b) => {
  const currency = Number(b.PaymentCoinUSDCurrency) > 0 ? Number(b.PaymentCoinUSDCurrency) : 1
  return sum + Number(b.PaymentAmount) * currency + Number(b.PayWithBalanceAmount) * currency
}, 0))

const orderUsers = computed(() => {
  const users = new Map<string, number>()
  displayOrders.value.filter((el) => el.OrderState === order.OrderState.PAID).forEach((el) => {
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
const currentOrder = ref({} as order.Order)

const onRowClick = (row: order.Order) => {
  orderInfoDialog.value = true
  currentOrder.value = { ...row }
}

const onMenuHide = () => {
  currentOrder.value = {} as order.Order
  orderInfoDialog.value = false
}

const onCancel = () => {
  onMenuHide()
}

const cancelOrder = () => {
  orderInfoDialog.value = false
  sdk.updateAppUserOrder(currentOrder.value.ID, true)
}

watch(sdk.AppID, () => {
  onRequestOrders()
  onRequestAppGoods()
})

onMounted(() => {
  onRequestOrders()
  onRequestAppGoods()
})

const loading = ref(false)
const onRequestOrders = () => {
  if (sdk.orders.value.length) {
    return
  }
  loading.value = true
  sdk.getNAppOrders(0, 0, () => {
    loading.value = false
  })
}

const onRequestAppGoods = () => {
  if (sdk.appGoods.value.length) {
    return
  }
  sdk.getNAppGoods(0, 0)
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: order.Order) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: order.Order) => row.AppID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: order.Order) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: order.Order) => row.GoodName
  },
  {
    name: 'GoodUnit',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: order.Order) => row.GoodUnit
  },
  {
    name: 'GoodUnitPrice',
    label: t('MSG_GOOD_UNIT_PRICE'),
    sortable: true,
    field: (row: order.Order) => row.GoodUnitPrice
  },
  {
    name: 'GoodValue',
    label: t('MSG_GOOD_VALUE'),
    sortable: true,
    field: (row: order.Order) => row.GoodValue
  },
  {
    name: 'Units',
    label: t('MSG_UNITS'),
    sortable: true,
    field: (row: order.Order) => row.Units
  },
  {
    name: 'PaymentID',
    label: t('MSG_PAYMENT_ID'),
    sortable: true,
    field: (row: order.Order) => row.PaymentID
  },
  {
    name: 'PaymentCoinTypeID',
    label: t('MSG_PAYMENT_COINTYPE_ID'),
    sortable: true,
    field: (row: order.Order) => row.PaymentCoinTypeID
  },
  {
    name: 'PaymentCoinName',
    label: t('MSG_PAYMENT_COINNAME'),
    sortable: true,
    field: (row: order.Order) => row.PaymentCoinName
  },
  {
    name: 'PaymentCoinUnit',
    label: t('MSG_PAYMENT_COIN_UNIT'),
    sortable: true,
    field: (row: order.Order) => row.PaymentCoinUnit
  },
  {
    name: 'CoinPresale',
    label: t('MSG_COIN_PRESALE'),
    sortable: true,
    field: (row: order.Order) => row.CoinPresale
  },
  {
    name: 'PaymentAddress',
    label: t('MSG_PAYMENT_ADDRESS'),
    sortable: true,
    field: (row: order.Order) => row.PaymentAddress
  },
  {
    name: 'PaymentCoinUSDCurrency',
    label: t('MSG_PAYMENT_COIN_USD_CURRENCY'),
    sortable: true,
    field: (row: order.Order) => row.PaymentCoinUSDCurrency
  },
  {
    name: 'PaymentLiveUSDCurrency',
    label: t('MSG_PAYMENT_LIVE_USD_CURRENCY'),
    sortable: true,
    field: (row: order.Order) => row.PaymentLiveUSDCurrency
  },
  {
    name: 'PaymentLocalUSDCurrency',
    label: t('MSG_PAYMENT_LOCAL_USD_CURRENCY'),
    sortable: true,
    field: (row: order.Order) => row.PaymentLocalUSDCurrency
  },
  {
    name: 'PaymentAmount',
    label: t('MSG_PAYMENT_AMOUNT'),
    sortable: true,
    field: (row: order.Order) => row.PaymentAmount
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: order.Order) => row.OrderType
  },
  {
    name: 'State',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: order.Order) => row.OrderState
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: order.Order) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: order.Order) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: order.Order) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'PaidAt',
    label: t('MSG_PAID_AT'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.PaidAt)
  },
  {
    name: 'Start',
    label: t('MSG_START'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.StartAt)
  },
  {
    name: 'End',
    label: t('MSG_END'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.EndAt)
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
