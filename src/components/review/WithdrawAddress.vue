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
import { onMounted, watch, computed } from 'vue'
import { sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const withdrawAddress = computed(() => sdk.userWithdrawAccount.userWithdrawAccounts(undefined, undefined))

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (withdrawAddress.value.length === 0) {
    sdk.userWithdrawAccount.adminGetUserWithdrawAccounts(0, 0)
  }
}

</script>
