<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_WITHDRAWS")'
    :rows='withdraws'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { getAppWithdraws } from 'src/api/ledger'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'
import { useChurchLedgerWithdrawStore } from 'npool-cli-v4'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const withdraw = useChurchLedgerWithdrawStore()
const withdraws = computed(() => withdraw.getWithdrawsByAppID(appID.value))

const prepare = () => {
  getAppWithdraws(0, 500)
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
