<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEES")'
    :rows='displayFees'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(ev, row, index) => onRowClick(row as fee.Fee)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
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
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model.number='target.UnitValue' :label='$t("MSG_UNIT_VALUE")' />
      </q-card-section>
      <q-card-section>
        <q-select :options='goodbase.GoodTypes' v-model='target.GoodType' :label='$t("MSG_GOOD_TYPE")' />
        <q-select :options='goodbase.GoodSettlementTypes' v-model='target.SettlementType' :label='$t("MSG_SETTLEMENT_TYPE")' />
        <q-select :options='goodbase.GoodDurationTypes' v-model='target.DurationDisplayType' :label='$t("MSG_DURATION_DISPLAY_TYPE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, sdk, fee, goodbase } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const fees = sdk.fees

const goodName = ref('')
const displayFees = computed(() => {
  const name = goodName.value.toLowerCase()
  return fees.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.Name.toLowerCase().includes(name) ||
          el.GoodID.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!fees.value.length) {
    sdk.getFees(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.GoodID
  },
  {
    name: 'Name',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: fee.Fee) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: fee.Fee) => row.GoodType
  },
  {
    name: 'DurationDisplayType',
    label: t('MSG_DURATION_DISPLAY_TYPE'),
    sortable: true,
    field: (row: fee.Fee) => row.DurationDisplayType
  },
  {
    name: 'UnitValue',
    label: t('MSG_UNIT_VALUE'),
    sortable: true,
    field: (row: fee.Fee) => row.UnitValue
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: fee.Fee) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATEDAT'),
    sortable: true,
    field: (row: fee.Fee) => utils.formatTime(row.UpdatedAt)
  }
])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as fee.Fee)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: fee.Fee) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as fee.Fee
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateFee() : createFee()
}

const onCancel = () => {
  onMenuHide()
}

const createFee = () => {
  sdk.adminCreateFee(target.value, () => {
    onMenuHide()
  })
}

const updateFee = () => {
  sdk.adminUpdateFee(target.value, () => {
    onMenuHide()
  })
}

</script>

<style lang='sass' scoped>
</style>
