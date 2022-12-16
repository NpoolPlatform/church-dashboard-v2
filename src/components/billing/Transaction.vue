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
import { computed, onMounted } from 'vue'

const tx = useChurchTxStore()
const transactions = computed(() => tx.Txs.Txs)

const prepare = () => {
  if (transactions.value.length === 0) {
    getTxs(0, 500)
  }
}

onMounted(() => {
  prepare()
})

</script>
