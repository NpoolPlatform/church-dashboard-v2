<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST")'
    :rows='topMosts'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
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
        <q-select :options='goodbase.GoodTypeMostTypes' :disable='updating' v-model='target.TopMostType' :label='$t("MSG_TOPMOST_TYPE")' />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_POSTERS'
          filled
          v-model='target.Posters'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' /></div>
        <div> <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <TopMostGood />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { topmost, sdk, utils, goodbase } from 'src/npoolstore'

const AppID = sdk.AppID

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const TopMostGood = defineAsyncComponent(() => import('src/components/good/TopMostGood.vue'))

const topMosts = sdk.topMosts
const target = ref({} as topmost.TopMost)

const showing = ref(false)
const updating = ref(false)

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
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  if (updating.value) {
    sdk.adminUpdateTopMost(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMost(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  }
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
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmost.TopMost) => row.TopMostType
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
    name: 'Posters',
    label: 'MSG_POSTERS',
    sortable: true,
    field: (row: topmost.TopMost) => row.Posters?.join(',')
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
