<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_TRANSACTIONS")'
    :rows='transactions'
    row-key='ID'
    v-model:pagination='pagination'
    @request='handlePageChange'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useChurchTxStore } from 'npool-cli-v4'
import { Pagination } from 'src/localstore/pagination/type'
import { computed, onMounted, ref } from 'vue'

const tx = useChurchTxStore()
const transactions = computed(() => tx.Txs.Txs)

const pagination = ref({
  sortBy: 'ID',
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 10
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
  }, (error: boolean) => {
    if (error) {
      return
    }
    pagination.value.rowsNumber = tx.Txs.Total
  })
}

const prepare = () => {
  if (transactions.value.length === 0) {
    getTxs(pagination.value.page - 1, pagination.value.rowsPerPage)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePageChange = (row: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const page = row?.pagination as Pagination
  pagination.value = { ...page }
  console.log('page: ', page)
  tx.$reset()
  getTxs((pagination.value.page - 1) * pagination.value.rowsPerPage, pagination.value.rowsPerPage)
}

onMounted(() => {
  prepare()
})

</script>
