<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_DISPLAY_COLORS")'
    :rows='displayColors'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplaycolor.DisplayColor)'
    selection='single'
    v-model:selected='selectedDisplayColors'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='color'
          :label='$t("MSG_COLOR")'
        />
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
          :disable='selectedDisplayColor === undefined'
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
        <q-input v-model='target.Color' :label='$t("MSG_DISPLAY_COLOR")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Index' :label='$t("MSG_DISPLAY_COLOR_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { sdk, appgooddisplaycolor } from 'src/npoolstore'

import AppGoodSelector from './AppGoodSelector.vue'

const AppID = sdk.AppID

const appGoods = sdk.appGoods
const goodDisplayColors = sdk.goodDisplayColors
const color = ref('')
const displayColors = computed(() => {
  const _color = color.value?.toLowerCase()
  return goodDisplayColors.value?.filter((el) => el.Color?.toLowerCase().includes(_color))
})
const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgooddisplaycolor.DisplayColor)
const selectedDisplayColors = ref([] as appgooddisplaycolor.DisplayColor[])
const selectedDisplayColor = computed(() => selectedDisplayColors.value[0])

const selectedAppGood = computed(() => sdk.appGood(target.value?.AppGoodID))

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = {} as appgooddisplaycolor.DisplayColor
}

const onRowClick = (row: appgooddisplaycolor.DisplayColor) => {
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
  if (updating.value) {
    sdk.adminUpdateGoodDisplayColor(target.value, () => {
      showing.value = false
    })
  } else {
    sdk.adminCreateGoodDisplayColor(target.value, () => {
      showing.value = false
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteGoodDisplayColor(selectedDisplayColor.value, () => {
    selectedDisplayColors.value = []
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
  if (!goodDisplayColors.value.length) {
    sdk.adminGetGoodDisplayColors(0, 0)
  }
}
</script>
