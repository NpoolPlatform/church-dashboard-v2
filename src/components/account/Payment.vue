<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENT_ADDRESSES")'
    :rows='displayAccounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedAccount'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='address'
        :label='$t("MSG_ADDRESS")'
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
  useCoinStore
} from 'npool-cli-v2'
import { PlatformAccount, useChurchPaymentAccountStore } from 'npool-cli-v4'
import { getPaymentAccounts } from 'src/api/account'
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()

const payment = useChurchPaymentAccountStore()
const paymentAccounts = computed(() => payment.PaymentAccounts.PaymentAccounts)
const displayAccounts = computed(() => paymentAccounts.value.filter((el) => {
  return el.Address?.includes(address.value)
}))

const address = ref('')
const selectedAccount = ref([] as Array<PlatformAccount>)

const onCreatePaymentBalance = () => {
  // selectedAccount.value.forEach((account) => {
  //   if (account.Idle) {
  //     return
  //   }
  //   if (account.PaymentState !== PaymentState.TIMEOUT) {
  //     return
  //   }
  //   if (account.UserPaymentBalanceID !== InvalidID) {
  //     return
  //   }

  //   const index = payments.value?.findIndex((el) => el.AccountID === account.AccountID)
  //   const payment = payments.value?.[index as number] as Payment
  //   if (payment.FinishAmount <= payment.StartAmount) {
  //     return
  //   }

  //   billing.createPaymentBalance({
  //     TargetAppID: appID.value,
  //     TargetUserID: payment.UserID,
  //     Info: {
  //       PaymentID: payment.ID,
  //       Amount: payment.FinishAmount - payment.StartAmount,
  //       UsedByPaymentID: InvalidID
  //     },
  //     Message: {
  //       Error: {
  //         Title: 'MSG_GET_GOOD_PAYMENTS',
  //         Message: 'MSG_GET_GOOD_PAYMENTS_FAIL',
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  // })
}

const onResetPaymentAccount = () => {
  // selectedAccount.value.forEach((acc) => {
  //   if (acc.Idle) {
  //     return
  //   }
  //   acc.Idle = true
  //   acc.OccupiedBy = ''
  //   account.updateGoodPayment({
  //     Info: acc,
  //     Message: {
  //       Error: {
  //         Title: 'MSG_UPDATE_GOOD_PAYMENTS',
  //         Message: 'MSG_UPDATE_GOOD_PAYMENTS_FAIL',
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  // })
}

onMounted(() => {
  if (paymentAccounts.value.length === 0) {
    getPaymentAccounts(0, 500)
  }
  if (coin.Coins.length === 0) {
    getCoins()
  }
})
</script>
