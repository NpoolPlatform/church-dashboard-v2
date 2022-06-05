<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENT_ADDRESSES")'
    :rows='displayAccounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    :selected='selectedAccount'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='searchStr'
        :label='$t("MSG_SEARCH")'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE_PAYMENT_BALANCE")'
        @click='onCreatePaymentBalance'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_RESET_PAYMENT_ACCOUNT")'
        @click='onResetPaymentAccount'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import {
  useChurchAccountStore,
  useCoinStore,
  NotificationType,
  GoodPayment,
  PaymentState,
  useChurchBillingStore,
  InvalidID,
  Payment
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchAccountStore()
const coin = useCoinStore()

interface MyAccount extends GoodPayment {
  CoinName: string
  Address: string
  PaymentState: PaymentState
  PaymentID: string
  OrderID: string
  UserPaymentBalanceID: string
}

const billing = useChurchBillingStore()
const payments = computed(() => billing.Payments.get(appID.value)?.filter((el) => el.State === PaymentState.TIMEOUT || el.State === PaymentState.CANCELED))
const balances = computed(() => billing.PaymentBalances.get(appID.value))

const accounts = computed(() => Array.from(account.GoodPayments).map((el) => {
  const ac = el as MyAccount
  ac.Address = account.getAccountByID(ac.AccountID)?.Address
  ac.CoinName = coin.getCoinByID(account.getAccountByID(ac.AccountID)?.CoinTypeID)?.Name as string
  ac.PaymentState = 'MSG_NOT_AVAILABLE' as PaymentState
  ac.PaymentID = InvalidID
  ac.UserPaymentBalanceID = InvalidID
  if (payments.value) {
    const index = payments.value.findIndex((pel) => pel.AccountID === el.AccountID && !el.Idle)
    if (index >= 0) {
      ac.PaymentState = payments.value[index].State as PaymentState
      ac.PaymentID = payments.value[index].ID
      ac.OrderID = payments.value[index].OrderID
    }
  }
  if (balances.value) {
    const index = balances.value.findIndex((bel) => bel.PaymentID === ac.PaymentID)
    if (index >= 0) {
      ac.UserPaymentBalanceID = balances.value[index].ID as string
    }
  }
  return ac
}))

const searchStr = ref('')
const displayAccounts = computed(() => accounts.value.filter((el) => {
  return el.Address?.includes(searchStr.value)
}))

const selectedAccount = ref([] as Array<MyAccount>)

const prepare = () => {
  billing.getPayments({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_PAYMENTS',
        Message: 'MSG_GET_PAYMENTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  billing.getPaymentBalances({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_USER_PAYMENT_BALANCES',
        Message: 'MSG_GET_USER_PAYMENT_BALANCES_FAIL',
        Popup: true,
        Type: NotificationType.Error
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

  account.getGoodPayments({
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_PAYMENTS',
        Message: 'MSG_GET_GOOD_PAYMENTS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  prepare()
})

const onCreatePaymentBalance = () => {
  selectedAccount.value.forEach((account) => {
    if (account.Idle) {
      return
    }
    if (account.PaymentState !== PaymentState.TIMEOUT) {
      return
    }
    if (account.UserPaymentBalanceID !== InvalidID) {
      return
    }

    const index = payments.value?.findIndex((el) => el.AccountID === account.AccountID)
    const payment = payments.value?.[index as number] as Payment
    if (payment.FinishAmount <= payment.StartAmount) {
      return
    }

    billing.createPaymentBalance({
      TargetAppID: appID.value,
      TargetUserID: payment.UserID,
      Info: {
        PaymentID: payment.ID,
        Amount: payment.FinishAmount - payment.StartAmount,
        UsedByPaymentID: InvalidID
      },
      Message: {
        Error: {
          Title: 'MSG_GET_GOOD_PAYMENTS',
          Message: 'MSG_GET_GOOD_PAYMENTS_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onResetPaymentAccount = () => {
  selectedAccount.value.forEach((acc) => {
    if (acc.Idle) {
      return
    }
    acc.Idle = true
    acc.OccupiedBy = ''
    account.updateGoodPayment({
      Info: acc,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_GOOD_PAYMENTS',
          Message: 'MSG_UPDATE_GOOD_PAYMENTS_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

</script>
