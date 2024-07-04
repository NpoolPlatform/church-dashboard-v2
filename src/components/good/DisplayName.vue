<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DISPLAY_NAMES")'
    :rows='displayNames'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplayname.DisplayName)'
    selection='single'
    v-model:selected='selectedDisplayNames'
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
          :disable='selectedDisplayName === undefined'
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
        <span>{{ updating ? $t('MSG_UPDATE_DISPLAY_NAME') : $t('MSG_CREATE_DISPLAY_NAME') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ selectedAppGood?.AppGoodName }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-if='!updating' v-model:app-good-id='target.AppGoodID' />
        <q-input v-model='target.Name' :label='$t("MSG_DISPLAY_NAME")' />
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
import { sdk, appgooddisplayname } from 'src/npoolstore'

import AppGoodSelector from './AppGoodSelector.vue'

const AppID = sdk.AppID

const displayNames = sdk.goodDisplayNames

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgooddisplayname.DisplayName)
const selectedDisplayNames = ref([] as Array<appgooddisplayname.DisplayName>)
const selectedDisplayName = computed(() => selectedDisplayNames.value[0])

const selectedAppGood = computed(() => sdk.appGood(target.value?.AppGoodID))

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appgooddisplayname.DisplayName) => {
  target.value = row
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
}

const onSubmit = () => {
  submitting.value = true
  if (updating.value) {
    sdk.adminUpdateGoodDisplayName(target.value, () => {
      showing.value = false
    })
  } else {
    sdk.adminCreateGoodDisplayName(target.value, () => {
      showing.value = false
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteGoodDisplayName(selectedDisplayName.value, () => {
    selectedDisplayNames.value = []
  })
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!displayNames.value.length) {
    sdk.adminGetGoodDisplayNames(0, 0)
  }
}
</script>
