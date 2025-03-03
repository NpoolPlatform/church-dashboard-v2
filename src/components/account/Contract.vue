<template>
  <q-table
    dense
    flat
    :rows='displayContractAccounts'
    :title='$t("MSG_CONTRACT_ADDRESSES")'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as contractaccount.Account)'
  >
    <template #top>
      <div class='row justify-end table-right'>
        <TableHeaderFilter v-model:backup='backup' v-model:blocked='blocked' v-model:active='active' v-model:locked='locked' />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { contractaccount, sdk } from 'src/npoolstore'

const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const accounts = sdk.contractAccounts

const backup = ref(null)
const blocked = ref(null)
const active = ref(null)
const locked = ref(null)

const displayContractAccounts = computed(() => accounts.value.filter((el) => {
  let flag = true
  if (backup.value !== null) {
    flag = flag && el.Backup === backup.value
  }
  if (blocked.value !== null) {
    flag = flag && el.Blocked === blocked.value
  }
  if (active.value !== null) {
    flag = flag && el.Active === active.value
  }
  if (locked.value !== null) {
    flag = flag && el.Locked === locked.value
  }
  return flag
}))

const showing = ref(false)
const target = ref({} as contractaccount.Account)

const onRowClick = (row: contractaccount.Account) => {
  target.value = { ...row }
  showing.value = true
}

onMounted(() => {
  if (!accounts.value.length) {
    sdk.adminGetContractAccounts(0, 0)
  }
})
</script>
<style lang='sass' scoped>
.table-right
  width: 100%
  ::v-deep .button
    line-height: 30px
    height: 30px
    margin-left: 10px
</style>
