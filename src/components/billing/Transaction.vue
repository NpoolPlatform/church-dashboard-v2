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
import { useChurchTxStore } from 'npool-cli-v4'
import { getTxs } from 'src/api/chain'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const tx = useChurchTxStore()
const transactions = computed(() => tx.getTxsByAppID(appID.value))

const prepare = () => {
  if (transactions.value.length === 0) {
    getTxs(0, 500)
  }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
