<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_POSTERS")'
    :rows='posters'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodposter.Poster)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_POSTER') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ target.Poster }}</span>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :poster='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :poster='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { sdk, appgoodposter } from 'src/npoolstore'

const AppID = sdk.AppID
const posters = sdk.goodPosters

const showing = ref(false)
const submitting = ref(false)
const target = ref(undefined as unknown as appgoodposter.Poster)

const onRowClick = (row: appgoodposter.Poster) => {
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
  sdk.adminUpdateGoodPoster(target.value, () => {
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
  if (posters.value.length === 0) {
    sdk.adminGetGoodPosters(0, 0)
  }
}
</script>
