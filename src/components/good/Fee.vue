<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEES")'
    :rows='displayFees'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
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
        <span>{{ $t('MSG_CREATE_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.QuantityUnit' :label='$t("MSG_UNIT")' />
        <q-input v-model='target.QuantityUnitAmount' :label='$t("MSG_UNIT_POWER")' />
        <q-input v-model='target.UnitPrice' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <DatePicker v-model:date='target.DeliveryAt' :updating='updating' :label='$t("MSG_DELIVERY_AT")' />
        <DatePicker v-model:date='target.ServiceStartAt' :updating='updating' :label='$t("MSG_SERVICE_START_AT")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Total' :label='$t("MSG_GOOD_TOTAL")' type='number' :min='1' />
        <q-input v-model.number='target.BenefitIntervalHours' :label='$t("MSG_BENEFIT_INTERVAL_HOURS")' type='number' :min='1' />
        <q-input v-model='target.UnitLockDeposit' :label='$t("MSG_UNIT_LOCK_DEPOSIT")' />
      </q-card-section>
      <q-card-section>
        <DeviceInfoPicker v-model:device='target.DeviceTypeID' />
        <VendorLocationPicker v-model:location='target.VendorLocationID' />
      </q-card-section>
      <q-card-section>
        <q-select :options='goodbase.BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
        <q-select :options='goodbase.GoodTypes' v-model='target.GoodType' :label='$t("MSG_GOOD_TYPE")' />
        <q-select :options='goodbase.StartModes' v-model='target.StartMode' :label='$t("MSG_START_MODE")' />
      </q-card-section>
      <q-card-section>
        <q-toggle dense v-model='target.TestOnly' :label='$t("MSG_TESTONLY")' />
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
import { good, utils, sdk, fee, goodbase } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goods = sdk.fees

const goodName = ref('')
const displayFees = computed(() => {
  const name = goodName.value.toLowerCase()
  return goods.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.Name.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!goods.value.length) {
    sdk.getFees(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: good.Good) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: good.Good) => row.EntID
  },
  {
    name: 'Name',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: good.Good) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.GoodType
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: good.Good) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.CreatedAt)
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
  sdk.adminCreateFee(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateFee = () => {
  // TODO
}

</script>

<style lang='sass' scoped>
</style>
