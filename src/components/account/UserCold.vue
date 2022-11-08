<template>
  <q-table
    dense
    flat
    :rows='userBenefitCold'
    :title='$t("MSG_USER_BENEFIT_COLDS")'
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
  <UsedFor v-model:update='updating' v-model:visible='showing' :used-for='AccountUsedFor.UserBenefitCold' v-model:account='target' />
</template>

<script setup lang='ts'>
import { AccountUsedFor, PlatformAccount, useChurchPlatformAccountStore } from 'npool-cli-v4'
import { getPlatformAccounts } from 'src/api/account'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const UsedFor = defineAsyncComponent(() => import('src/components/account/AccountUsedFor.vue'))

const platform = useChurchPlatformAccountStore()
const userBenefitCold = computed(() => platform.getAccountsByKey(AccountUsedFor.UserBenefitCold))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PlatformAccount)

const onCreate = () => {
  showing.value = true
  updating.value = false
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
