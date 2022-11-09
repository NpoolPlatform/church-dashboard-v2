<template>
  <q-table
    dense
    flat
    :rows='platformAccounts'
    :title='$t("MSG_PLATFORM_ADDRESSES")'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as PlatformAccount)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <UsedFor v-model:update='updating' v-model:visible='showing' v-model:used-for='AccountUsedFor.PlatformBenefitCold' v-model:account='target' />
</template>

<script setup lang='ts'>
import { PlatformAccount, useChurchPlatformAccountStore, AccountUsedFor } from 'npool-cli-v4'
import { getPlatformAccounts } from 'src/api/account'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const UsedFor = defineAsyncComponent(() => import('src/components/account/AccountUsedFor.vue'))

const platform = useChurchPlatformAccountStore()
const platformAccounts = computed(() => platform.getAccountsByKey(AccountUsedFor.PlatformBenefitCold))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PlatformAccount)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { UsedFor: AccountUsedFor.PlatformBenefitCold } as PlatformAccount
}

const onRowClick = (row: PlatformAccount) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

onMounted(() => {
  if (platform.PlatformAccounts.PlatformAccounts.length === 0) {
    getPlatformAccounts(0, 500)
  }
})
</script>
