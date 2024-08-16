<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_CONSTRAINTS")'
    :rows='topMostConstraints'
    row-key='ID'
    :columns='columns'
    selection='single'
    v-model:selected='selectedTopmostConstraint'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostconstraint.TopMostConstraint)'
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
          :disable='!selectedTopmostConstraint?.length'
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
        <TopMostSelector v-model:top-most-id='target.TopMostID' :read-only='updating' />
        <q-select :options='goodbase.GoodTopMostConstraints' :disable='updating' v-model='target.Constraint' :label='$t("MSG_TOPMOST_CONSTRAINT")' />
        <q-input v-model='target.TargetValue' :label='$t("MSG_TARGET_VALUE")' />
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
import { sdk, utils, topmostconstraint, goodbase } from 'src/npoolstore'

import TopMostSelector from './TopMostSelector.vue'

const AppID = sdk.AppID

const topMostConstraints = sdk.topMostConstraints
const target = ref({} as topmostconstraint.TopMostConstraint)
const selectedTopmostConstraint = ref([] as Array<topmostconstraint.TopMostConstraint>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostconstraint.TopMostConstraint) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostconstraint.TopMostConstraint
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = () => {
  submitting.value = true
  if (updating.value) {
    sdk.adminUpdateTopMostConstraint(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.adminCreateTopMostConstraint(target.value, (error: boolean) => {
      if (error) return
      onMenuHide()
    })
  }
}

const onDelete = () => {
  sdk.adminDeleteTopMostConstraint(selectedTopmostConstraint.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!topMostConstraints.value?.length) {
    sdk.adminGetTopMostConstraints(0, 0)
  }
})

onMounted(() => {
  if (!topMostConstraints.value?.length) {
    sdk.adminGetTopMostConstraints(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.AppID
  },
  {
    name: 'Constraint',
    label: 'MSG_CONSTRAINT',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.Constraint
  },
  {
    name: 'TargetValue',
    label: 'MSG_TARGET_VALUE',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.TargetValue
  },
  {
    name: 'Index',
    label: 'MSG_INDEX',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.Index
  },
  {
    name: 'TopMostID',
    label: 'MSG_TOPMOST_ID',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.TopMostID
  },
  {
    name: 'Title',
    label: 'MSG_TOPMOST_TITLE',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.TopMostTitle
  },
  {
    name: 'Message',
    label: 'MSG_TOPMOST_MESSAGE',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.TopMostMessage
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOPMOST_TYPE',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => row.TopMostType
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostconstraint.TopMostConstraint) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
