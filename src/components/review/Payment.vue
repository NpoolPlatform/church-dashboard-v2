<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REVIEW_TIMEOUT_PAYMENTS")'
    :rows='payments'
    row-key='ID'
    :loading='paymentLoading'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_REVIEW_USER_PAYMENT_BALANCES")'
    :rows='balances'
    row-key='ID'
    :loading='balanceLoading'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useChurchBillingStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const billing = useChurchBillingStore()
const payments = computed(() => billing.Payments.get(appID.value))
const balances = computed(() => billing.PaymentBalances.get(appID.value))

const paymentLoading = ref(false)
const balanceLoading = ref(false)

const prepare = () => {
  paymentLoading.value = true
  balanceLoading.value = true

  billing.getPayments({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENTS'),
        Message: t('MSG_GET_PAYMENTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    paymentLoading.value = false
  })

  billing.getPaymentBalances({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENT_BALANCES'),
        Message: t('MSG_GET_PAYMENT_BALANCES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    balanceLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
