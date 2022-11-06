<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_PAYMENT_ADDRESSES")'
    :rows='displayAccounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as PaymentAccount)'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='address'
        :label='$t("MSG_ADDRESS")'
      />
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_APPLICATION') }}</span>
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, PaymentAccount, useChurchPaymentAccountStore } from 'npool-cli-v4'
import { getPaymentAccounts } from 'src/api/account'
import { computed, onMounted, ref } from 'vue'

const payment = useChurchPaymentAccountStore()
const paymentAccounts = computed(() => payment.PaymentAccounts.PaymentAccounts)
const displayAccounts = computed(() => paymentAccounts.value.filter((el) => {
  return el.Address?.includes(address.value)
}))

const address = ref('')

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PaymentAccount)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as PaymentAccount
}

const onRowClick = (row: PaymentAccount) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Active: target.value.Active,
    Blocked: target.value.Blocked,
    Locked: target.value.Locked
  }
})

const onSubmit = (done: () => void) => {
  payment.updatePaymentAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_PAYMENT_ACCOUNT',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_PAYMENT_ACCOUNT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: PaymentAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (paymentAccounts.value.length === 0) {
    getPaymentAccounts(0, 500)
  }
})
</script>
