<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DISPLAY_NAMES")'
    :rows='displaynames'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplayname.DisplayName)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_DISPLAY_NAME') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_DISPLAY_NAME")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Index' :label='$t("MSG_DISPLAY_NAME_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { sdk, appgooddisplayname } from 'src/npoolstore'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const displaynames = sdk.goodDisplayNames

const showing = ref(false)
const target = ref(undefined as unknown as appgooddisplayname.DisplayName)

const onRowClick = (row: appgooddisplayname.DisplayName) => {
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
  sdk.adminUpdateGoodDisplayName(target.value, () => {
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
  if (!appGoods.value.length) {
    sdk.adminGetAppGoods(0, 0)
  }
  if (!displaynames.value.length) {
    sdk.adminGetGoodDisplayNames(0, 0)
  }
}
</script>
