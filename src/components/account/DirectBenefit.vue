<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DIRECT_BENEFIT_ADDRESS")'
    :rows='directBenefitAccounts'
    row-key='ID'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import {
  useChurchUserAccountStore
} from 'npool-cli-v4'
import { getNAppUserAccounts } from 'src/api/account'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchUserAccountStore()
const directBenefitAccounts = computed(() => account.directBenefitAddress(appID.value))

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!account.UserAccounts.UserAccounts.get(appID.value)) {
    getNAppUserAccounts(0, 500)
  }
}

</script>
