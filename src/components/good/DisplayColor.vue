<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DISPLAY_COLORS")'
    :rows='displaycolors'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplaycolor.DisplayColor)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_DISPLAY_COLOR') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.DisplayColor' :label='$t("MSG_DISPLAY_COLOR")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Index' :label='$t("MSG_DISPLAY_COLOR_INDEX")' />
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
import { sdk, appgooddisplaycolor } from 'src/npoolstore'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const displaycolors = sdk.goodDisplayColors

const showing = ref(false)
const target = ref(undefined as unknown as appgooddisplaycolor.DisplayColor)

const onRowClick = (row: appgooddisplaycolor.DisplayColor) => {
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
  sdk.adminUpdateGoodDisplayColor(target.value, () => {
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
  if (!displaycolors.value.length) {
    sdk.adminGetGoodDisplayColors(0, 0)
  }
}
</script>
