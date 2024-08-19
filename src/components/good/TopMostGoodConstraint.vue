<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOOD_CONSTRAINTS")'
    :rows='topMostGoodConstraints'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgoodconstraint.TopMostGoodConstraint)'
    selection='single'
    v-model:selected='selectedConstraints'
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
          :disable='selectedConstraints.length === 0'
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
        <TopMostGoodSelector v-if='!updating' v-model:top-most-good-id='target.TopMostGoodID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.TargetValue' :label='$t("MSG_TARGET_VALUE")' />
        <q-input v-model='target.Index' :label='$t("MSG_DISPLAY_INDEX")' type='number' />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='goodbase.GoodTopMostConstraints'
          v-model='target.Constraint'
          :label='$t("MSG_CONSTRAINT")'
          :disable='updating'
        />
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
import { topmostgoodconstraint, sdk, utils, goodbase } from 'src/npoolstore'

import TopMostGoodSelector from 'src/components/good/TopMostGoodSelector.vue'

const AppID = sdk.AppID

const topMostGoodConstraints = sdk.topMostGoodConstraints
const selectedConstraints = ref([] as Array<topmostgoodconstraint.TopMostGoodConstraint>)
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

const onDelete = () => {
  sdk.adminDeleteTopMostGoodConstraint(selectedConstraints.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!topMostGoodConstraints.value?.length) {
    sdk.adminGetTopMostGoodConstraints(0, 0)
  }
})

onMounted(() => {
  if (!topMostGoodConstraints.value?.length) {
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
    name: 'Constraint',
    label: 'MSG_CONSTRAINT',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.Constraint
  },
  {
    name: 'TargetValue',
    label: 'MSG_TARGET_VALUE',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.TargetValue
  },
  {
    name: 'Index',
    label: 'MSG_INDEX',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => row.Index
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
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostgoodconstraint.TopMostGoodConstraint) => utils.formatTime(row.CreatedAt)
  }
])
</script>
