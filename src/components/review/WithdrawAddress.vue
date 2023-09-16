<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS_REVIEWS")'
    :rows='withdrawAddress'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { getNAppUserAccounts } from 'src/api/account'
import { AppID } from 'src/api/app'
import { computed, onMounted, watch } from 'vue'
import { useraccount, accountbase } from 'src/npoolstore'

const account = useraccount.useUserAccountStore()
const withdrawAddress = computed(() => account.accounts(AppID.value, accountbase.AccountUsedFor.UserWithdraw))

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (withdrawAddress.value.length === 0) {
    getNAppUserAccounts(0, 500)
  }
}

</script>
