<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_TRANSACTIONS")'
    :rows='transactions'
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
const transactions = computed(() => billing.Transactions.get(appID.value) ? billing.Transactions.get(appID.value) : [])

const prepare = () => {
  billing.getTransactions({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_TRANSACTIONS',
        Message: 'MSG_GET_TRANSACTIONS_FAIL',
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
