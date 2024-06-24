<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DESCRIPTIONS")'
    :rows='descriptions'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddescription.Description)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_DESCRIPTION') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.DescriptionIndex' :label='$t("MSG_DESCRIPTION_INDEX")' />
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
import { sdk, appgooddescription } from 'src/npoolstore'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const descriptions = sdk.goodDescriptions

const showing = ref(false)
const target = ref(undefined as unknown as appgooddescription.Description)

const onRowClick = (row: appgooddescription.Description) => {
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
  sdk.adminUpdateGoodDescription(target.value, () => {
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
  if (!descriptions.value.length) {
    sdk.adminGetGoodDescriptions(0, 0)
  }
}
</script>
