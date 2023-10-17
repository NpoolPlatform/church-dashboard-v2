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
import { computed, onMounted, ref } from 'vue'
import { tx, notify } from 'src/npoolstore'

const _tx = tx.useTxStore()
const transactions = computed(() => _tx.txs())

const loading = ref(false)

onMounted(() => {
  if (transactions.value.length === 0) {
    getTxs(0, 100)
  }
})

const getTxs = (offset: number, limit: number) => {
  _tx.getTxs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<tx.Tx>) => {
    if (error || rows?.length === 0) {
      loading.value = false
      return
    }
    getTxs(offset + limit, limit)
  })
}

</script>
