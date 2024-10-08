<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOSTS")'
    :rows='topMosts'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedTopMost'
    @row-click='(evt, row, index) => onRowClick(row as topmost.TopMost)'
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
          :disable='!selectedTopMost?.length'
          @click='onDelete'
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
        <span>{{ $t('MSG_TOPMOST') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model='target.TargetUrl' :label='$t("MSG_TARGET_URL")' />
        <q-select :options='goodbase.GoodTopMostTypes' :disable='updating' v-model='target.TopMostType' :label='$t("MSG_TOPMOST_TYPE")' />
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' /></div>
        <div> <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { topmost, sdk, utils, goodbase } from 'src/npoolstore'

const AppID = sdk.AppID

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const topMosts = sdk.topMosts
const target = ref({} as topmost.TopMost)
const selectedTopMost = ref([] as Array<topmost.TopMost>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmost.TopMost) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmost.TopMost
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  submitting.value = true
  if (updating.value) {
    sdk.adminUpdateTopMost(target.value, () => {
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMost(target.value, () => {
      onMenuHide()
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteTopMost(selectedTopMost.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!topMosts.value?.length) {
    sdk.adminGetTopMosts(0, 0)
  }
})

onMounted(() => {
  if (!topMosts.value?.length) {
    sdk.adminGetTopMosts(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmost.TopMost) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmost.TopMost) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmost.TopMost) => row.AppID
  },

  {
    name: 'Title',
    label: 'MSG_TITLE',
    sortable: true,
    field: (row: topmost.TopMost) => row.Title
  },
  {
    name: 'Message',
    label: 'MSG_MESSAGE',
    sortable: true,
    field: (row: topmost.TopMost) => row.Message
  },
  {
    name: 'TargetUrl',
    label: 'MSG_TARGET_URL',
    sortable: true,
    field: (row: topmost.TopMost) => row.TargetUrl
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmost.TopMost) => row.TopMostType
  },
  {
    name: 'StartAt',
    label: 'MSG_START_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.StartAt, undefined)
  },
  {
    name: 'EndAt',
    label: 'MSG_END_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.EndAt, undefined)
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
