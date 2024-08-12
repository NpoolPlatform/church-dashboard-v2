<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_POSTERS")'
    :rows='posters'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodposter.Poster)'
    selection='single'
    v-model:selected='selectedPosters'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedPoster === undefined'
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
        <span> {{ selectedAppGood?.AppGoodName }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-if='!updating' v-model:app-good-id='target.AppGoodID' />
        <q-input v-model='target.Poster' :label='$t("MSG_POSTER")' />
        <q-input v-model.number='target.Index' :label='$t("MSG_DISPLAY_NAME_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch, computed } from 'vue'
import { sdk, appgoodposter } from 'src/npoolstore'
import AppGoodSelector from './AppGoodSelector.vue'

const AppID = sdk.AppID
const posters = sdk.goodPosters

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgoodposter.Poster)
const selectedPosters = ref([] as appgoodposter.Poster[])
const selectedPoster = computed(() => selectedPosters.value[0])

const selectedAppGood = computed(() => sdk.appGood(target.value?.AppGoodID))

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appgoodposter.Poster) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appgoodposter.Poster
}

const onSubmit = () => {
  if (updating.value) {
    sdk.adminUpdateGoodPoster(target.value, () => {
      onMenuHide()
    })
  } else {
    sdk.adminCreateGoodPoster(target.value, () => {
      onMenuHide()
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteGoodPoster(selectedPoster.value, () => {
    selectedPosters.value = []
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
