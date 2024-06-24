<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOOD_POSTERS")'
    :rows='topMostGoods'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgoodposter.Poster)'
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
        <span>{{ $t('MSG_TOPMOST_GOOD_POSTER') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector :label='$t("MSG_APP_GOOD")' v-model:app-good-id='target.AppGoodID' />
        <TopMostSelector :label='$t("MSG_TOP_MOST")' v-model:top-most-id='target.TopMostID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Poster' :label='$t("MSG_POSTER")' />
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
import { topmostgoodposter, sdk, utils } from 'src/npoolstore'

const AppID = sdk.AppID

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const TopMostSelector = defineAsyncComponent(() => import('src/components/good/TopMostSelector.vue'))

const topMostGoods = sdk.topMostGoods
const target = ref({} as topmostgoodposter.Poster)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostgoodposter.Poster) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostgoodposter.Poster
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  if (updating.value) {
    sdk.adminUpdateTopMostGoodPoster(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMostGoodPoster(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  }
}

watch(AppID, () => {
  if (!topMostGoods.value?.length) {
    sdk.adminGetTopMostGoodPosters(0, 0)
  }
})

onMounted(() => {
  if (!topMostGoods.value?.length) {
    sdk.adminGetTopMostGoodPosters(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.AppID
  },
  {
    name: 'AppGoodID',
    label: 'MSG_APP_GOOD_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: 'MSG_APP_GOOD_NAME',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.AppGoodName
  },
  {
    name: 'TopMostID',
    label: 'MSG_TOP_MOST_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.TopMostID
  },
  {
    name: 'TopMostTitle',
    label: 'MSG_TOP_MOST_TITLE',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.TopMostTitle
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.TopMostType
  },
  {
    name: 'Poster',
    label: 'MSG_POSTER',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.Poster
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => utils.formatTime(row.CreatedAt)
  }
])
</script>
