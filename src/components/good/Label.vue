<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_LABELS")'
    :rows='labels'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodlabel.Label)'
    selection='single'
    v-model:selected='selectedLabels'
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
          :disable='selectedLabel === undefined'
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
        <span>{{ $t('MSG_UPDATE_LABEL') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ selectedAppGood?.AppGoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Icon' :label='$t("MSG_LABEL_ICON")' />
        <q-input v-model='target.IconBgColor' :label='$t("MSG_LABEL_ICON_BG_COLOR")' />
        <q-select :options='goodbase.GoodLabels' v-model='target.Label' :label='$t("MSG_LABEL")' />
        <q-input v-model='target.LabelBgColor' :label='$t("MSG_LABEL_BG_COLOR")' />
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
import { sdk, appgoodlabel, goodbase } from 'src/npoolstore'

const AppID = sdk.AppID
const labels = sdk.goodLabels

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgoodlabel.Label)
const selectedLabels = ref([] as appgoodlabel.Label[])
const selectedLabel = computed(() => selectedLabels.value[0])

const selectedAppGood = computed(() => sdk.appGood(target.value?.AppGoodID))

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appgoodlabel.Label) => {
  target.value = row
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appgoodlabel.Label
}

const onSubmit = () => {
  submitting.value = true
  if (updating.value) {
    sdk.adminUpdateGoodLabel(target.value, () => {
      onMenuHide()
    })
  } else {
    sdk.adminCreateGoodLabel(target.value, () => {
      onMenuHide()
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteGoodLabel(selectedLabel.value, () => {
    selectedLabels.value = []
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
