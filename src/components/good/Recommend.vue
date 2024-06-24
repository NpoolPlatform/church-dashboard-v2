<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodrecommend.Recommend)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.RecommendIndex' :label='$t("MSG_RECOMMEND_INDEX")' />
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
import { sdk, appgoodrecommend } from 'src/npoolstore'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const recommends = sdk.goodRecommends

const showing = ref(false)
const target = ref(undefined as unknown as appgoodrecommend.Recommend)

const onRowClick = (row: appgoodrecommend.Recommend) => {
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
  sdk.adminUpdateGoodRecommend(target.value, () => {
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
  if (!recommends.value.length) {
    sdk.adminGetGoodRecommends(0, 0)
  }
}
</script>
