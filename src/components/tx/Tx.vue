<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TXS")'
    :rows='displayTxs'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as tx.Tx)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_NAME")'
        />
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
        <q-select :options='[tx.TxState.StateTransferring]' v-model='state' :label='$t("MSG_TX_STATE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { sdk, tx } from 'src/npoolstore'

const _tx = tx.useTxStore()
const txs = computed(() => Array.from(_tx.Txs).sort((a, b) => b.CreatedAt - a.CreatedAt))

const name = ref('')
const displayTxs = computed(() => {
  const _name = name.value?.toLowerCase()
  return txs.value?.filter((el) => el.ChainTxID?.toLowerCase().includes(_name) ||
                              el.EntID?.toLowerCase().includes(_name) ||
                              el.Type?.toLowerCase().includes(_name) ||
                              el.State?.toLowerCase().includes(_name))
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const state = ref()
const target = ref({} as tx.Tx)

const onRowClick = (row: tx.Tx) => {
  showing.value = true
  updating.value = true
  target.value = { ...row }
  state.value = ''
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
}

const onSubmit = () => {
  sdk.tx.updateTx(target.value, () => {
    showing.value = false
  })
}

onMounted(() => {
  if (!txs.value.length) {
    sdk.tx.getTxs(0, 0)
  }
})
</script>
