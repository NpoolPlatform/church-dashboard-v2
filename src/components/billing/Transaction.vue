<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_TRANSACTIONS")'
    :rows='transactions'
    :loading='loading'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { NotifyType, Tx, useChurchTxStore } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

const tx = useChurchTxStore()
const transactions = computed(() => tx.Txs.Txs)

const loading = ref(false)

onMounted(() => {
  if (transactions.value.length === 0) {
    getTxs(0, 100)
  }
})

const getTxs = (offset : number, limit: number) => {
  tx.getTxs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Tx>) => {
    if (error || rows?.length === 0) {
      loading.value = false
      return
    }
    getTxs(offset, offset + limit)
  })
}

</script>
