<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_LABELS")'
    :rows='labels'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodlabel.Label)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_LABEL') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ target.Label }}</span>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { sdk, appgoodlabel } from 'src/npoolstore'

const AppID = sdk.AppID
const labels = sdk.goodLabels

const showing = ref(false)
const submitting = ref(false)
const target = ref(undefined as unknown as appgoodlabel.Label)

const onRowClick = (row: appgoodlabel.Label) => {
  target.value = row
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  sdk.adminUpdateGoodLabel(target.value, () => {
    showing.value = false
  })
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (labels.value.length === 0) {
    sdk.adminGetGoodLabels(0, 0)
  }
}
</script>
