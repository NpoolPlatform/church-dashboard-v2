<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOOD_CONSTRAINTS")'
    :rows='topMostGoods'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgoodconstraint.TopMostGoodConstraint)'
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
        <span>{{ $t('MSG_TOPMOST_GOOD_CONSTRAINT') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector :label='$t("MSG_APP_GOOD")' v-model:app-good-id='target.AppGoodID' />
        <TopMostSelector :label='$t("MSG_TOP_MOST")' v-model:top-most-id='target.TopMostID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.TargetValue' :label='$t("MSG_TARGET_VALUE")' />
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
import { topmostgoodconstraint, sdk, utils } from 'src/npoolstore'

const AppID = sdk.AppID

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const TopMostSelector = defineAsyncComponent(() => import('src/components/good/TopMostSelector.vue'))

const topMostGoods = sdk.topMostGoods
const target = ref({} as topmostgoodconstraint.TopMostGoodConstraint)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostgoodconstraint.TopMostGoodConstraint) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostgoodconstraint.TopMostGoodConstraint
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  if (updating.value) {
    sdk.adminUpdateTopMostGoodConstraint(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMostGoodConstraint(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  }
}

watch(AppID, () => {
  if (!topMostGoods.value?.length) {
    sdk.adminGetTopMostGoodConstraints(0, 0)
  }
})

onMounted(() => {
  if (!topMostGoods.value?.length) {
    sdk.adminGetTopMostGoodConstraints(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.AppID
  },
  {
    name: 'AppGoodID',
    label: 'MSG_APP_GOOD_ID',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: 'MSG_APP_GOOD_NAME',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.AppGoodName
  },
  {
    name: 'TopMostID',
    label: 'MSG_TOP_MOST_ID',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.TopMostID
  },
  {
    name: 'TopMostTitle',
    label: 'MSG_TOP_MOST_TITLE',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.TopMostTitle
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.TopMostType
  },
  {
    name: 'TargetValue',
    label: 'MSG_TARGET_VALUE',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.TargetValue
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => utils.formatTime(row.CreatedAt)
  }
])
</script>
