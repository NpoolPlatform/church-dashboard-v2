<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DESCRIPTIONS")'
    :rows='descriptions'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddescription.Description)'
    selection='single'
    v-model:selected='selectedDescriptions'
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
          :disable='selectedDescription === undefined'
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
        <span>{{ $t('MSG_UPDATE_DESCRIPTION') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ selectedAppGood?.AppGoodName }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:app-good-id='target.AppGoodID' />
        <q-input v-model='target.Description' :label='$t("MSG_DESCRIPTION")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Index' :label='$t("MSG_DESCRIPTION_INDEX")' />
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
import { sdk, appgooddescription } from 'src/npoolstore'

import AppGoodSelector from './AppGoodSelector.vue'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const descriptions = sdk.goodDescriptions

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgooddescription.Description)
const selectedDescriptions = ref([] as appgooddescription.Description[])
const selectedDescription = computed(() => selectedDescriptions.value[0])

const selectedAppGood = computed(() => sdk.appGood(target.value?.AppGoodID))

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appgooddescription.Description) => {
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
    sdk.adminUpdateGoodDescription(target.value, () => {
      showing.value = false
    })
  } else {
    sdk.adminCreateGoodDescription(target.value, () => {
      showing.value = false
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteGoodDescription(selectedDescription.value, () => {
    selectedDescriptions.value = []
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
