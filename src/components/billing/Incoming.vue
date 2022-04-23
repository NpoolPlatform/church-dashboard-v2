<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENTS")'
    :rows='payments'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useChurchBillingStore, NotificationType } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const billing = useChurchBillingStore()
const payments = computed(() => billing.Payments.get(appID.value) ? billing.Payments.get(appID.value) : [])

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
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
