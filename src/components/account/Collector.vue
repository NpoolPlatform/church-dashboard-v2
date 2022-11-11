<template>
  <q-table
    dense
    flat
    :rows='paymentCollector'
    :title='$t("MSG_PAYMENT_COLLECTOR")'
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
  <UsedFor v-model:update='updating' v-model:visible='showing' v-model:account='target' />
</template>

<script setup lang='ts'>
import { AccountUsedFor, PlatformAccount, useChurchPlatformAccountStore } from 'npool-cli-v4'
import { getPlatformAccounts } from 'src/api/account'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const UsedFor = defineAsyncComponent(() => import('src/components/account/AccountUsedFor.vue'))

const platform = useChurchPlatformAccountStore()
const paymentCollector = computed(() => platform.getAccountsByKey(AccountUsedFor.PaymentCollector))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PlatformAccount)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { UsedFor: AccountUsedFor.PaymentCollector } as PlatformAccount
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
