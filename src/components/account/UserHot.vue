<template>
  <q-table
    dense
    flat
    :rows='displayAccounts'
    :title='$t("MSG_USER_BENEFIT_HOTS")'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as platformaccount.Account)'
  >
    <template #top>
      <div class='row justify-end table-right'>
        <TableHeaderFilter v-model:backup='backup' v-model:blocked='blocked' v-model:active='active' v-model:locked='locked' />
        <div class='row indent flat align-bottom'>
          <q-btn
            dense
            flat
            class='btn flat'
            :label='$t("MSG_CREATE")'
            @click='onCreate'
          />
        </div>
      </div>
    </template>
  </q-table>
  <UsedFor v-model:update='updating' v-model:visible='showing' v-model:account='target' />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { platformaccount, accountbase, sdk } from 'src/npoolstore'

const UsedFor = defineAsyncComponent(() => import('src/components/account/AccountUsedFor.vue'))
const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const accounts = computed(() => sdk.platformAccounts(accountbase.AccountUsedFor.UserBenefitHot))

const backup = ref(null)
const blocked = ref(null)
const active = ref(null)
const locked = ref(null)

const displayAccounts = computed(() => accounts.value.filter((el) => {
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
const updating = ref(false)
const target = ref({} as platformaccount.Account)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { UsedFor: accountbase.AccountUsedFor.UserBenefitHot } as platformaccount.Account
}

const onRowClick = (row: platformaccount.Account) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

onMounted(() => {
  if (!accounts.value.length) {
    sdk.adminGetPlatformAccounts(0, 0)
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
