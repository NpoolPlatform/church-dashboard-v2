<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENT_ADDRESSES")'
    :rows='displayAccounts'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as paymentaccount.Account)'
  >
    <template #top>
      <div class='row justify-end table-right'>
        <TableHeaderFilter :backup='undefined' v-model:blocked='blocked' v-model:active='active' v-model:locked='locked' />
        <div class='row indent flat align-bottom'>
          <q-input
            dense
            class='small'
            v-model='address'
            :label='$t("MSG_ADDRESS")'
          />
        </div>
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <div>
          <span>{{ $t("MSG_ID") }}: {{ target?.ID }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_ACCOUNT_ID") }}: {{ target?.AccountID }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_ADDRESS") }}: {{ target?.Address }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_COIN_NAME") }}: {{ target?.CoinName }}</span>
        </div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Blocked' :label='$t("MSG_BLOCKED")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Active' :label='$t("MSG_ACTIVE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Locked' :label='$t("MSG_LOCKED")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { paymentaccount, sdk } from 'src/npoolstore'

const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const accounts = sdk.paymentAccounts

const address = ref('')
const blocked = ref(null)
const active = ref(null)
const locked = ref(null)

const displayAccounts = computed(() => accounts.value.filter((el) => {
  let flag = el.Address?.toLowerCase().includes(address.value?.toLowerCase())
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
const submitting = ref(false)
const target = ref({} as paymentaccount.Account)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as paymentaccount.Account
}

const onRowClick = (row: paymentaccount.Account) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  sdk.adminUpdatePaymentAccount(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

onMounted(() => {
  if (!accounts.value.length) {
    sdk.adminGetPaymentAccounts(0, 0)
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
