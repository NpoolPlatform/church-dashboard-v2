<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_POSTERS")'
    :rows='topMostPosters'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedTopmostPoster'
    @row-click='(evt, row, index) => onRowClick(row as topmostposter.Poster)'
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
          :disable='!selectedTopmostPoster?.length'
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
        <span>{{ $t('MSG_TOPMOST_POSTER') }}</span>
      </q-card-section>
      <q-card-section>
        <TopMostSelector v-model:top-most-id='target.TopMostID' :read-only='updating' />
        <q-input v-model='target.Poster' :label='$t("MSG_POSTER")' />
        <q-input v-model='target.Index' :label='$t("MSG_DISPLAY_INDEX")' type='number' />
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
import { sdk, utils, topmostposter } from 'src/npoolstore'

import TopMostSelector from './TopMostSelector.vue'

const AppID = sdk.AppID

const topMostPosters = sdk.topMostPosters
const target = ref({} as topmostposter.Poster)

const selectedTopmostPoster = ref([] as Array<topmostposter.Poster>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostposter.Poster) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostposter.Poster
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  submitting.value = true
  if (updating.value) {
    sdk.adminUpdateTopMostPoster(target.value, (error: boolean) => {
      submitting.value = false
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMostPoster(target.value, (error: boolean) => {
      submitting.value = false
      if (error) return
      onMenuHide()
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteTopMostPoster(selectedTopmostPoster.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!topMostPosters.value?.length) {
    sdk.adminGetTopMostPosters(0, 0)
  }
})

onMounted(() => {
  if (!topMostPosters.value?.length) {
    sdk.adminGetTopMostPosters(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostposter.Poster) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmostposter.Poster) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostposter.Poster) => row.AppID
  },
  {
    name: 'Poster',
    label: 'MSG_POSTER',
    sortable: true,
    field: (row: topmostposter.Poster) => row.Poster
  },
  {
    name: 'Index',
    label: 'MSG_INDEX',
    sortable: true,
    field: (row: topmostposter.Poster) => row.Index
  },
  {
    name: 'TopMostID',
    label: 'MSG_TOPMOST_ID',
    sortable: true,
    field: (row: topmostposter.Poster) => row.TopMostID
  },
  {
    name: 'Title',
    label: 'MSG_TOPMOST_TITLE',
    sortable: true,
    field: (row: topmostposter.Poster) => row.TopMostTitle
  },
  {
    name: 'Message',
    label: 'MSG_TOPMOST_MESSAGE',
    sortable: true,
    field: (row: topmostposter.Poster) => row.TopMostMessage
  },
  {
    name: 'TopMostTargetUrl',
    label: 'MSG_TOPMOST_TARGET_URL',
    sortable: true,
    field: (row: topmostposter.Poster) => row.TopMostTargetUrl
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOPMOST_TYPE',
    sortable: true,
    field: (row: topmostposter.Poster) => row.TopMostType
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostposter.Poster) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
