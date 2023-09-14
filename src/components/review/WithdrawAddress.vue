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
import {
  useChurchUserAccountStore
} from 'npool-cli-v4'
import { getNAppUserAccounts } from 'src/api/account'
import { AppID } from 'src/api/app'
import { computed, onMounted, watch } from 'vue'

const account = useChurchUserAccountStore()
const withdrawAddress = computed(() => account.withdrawAddress(AppID.value))

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
