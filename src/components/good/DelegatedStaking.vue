<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DELEGATEDSTAKINGS")'
    :rows='displayDelegatedStakings'
    row-key='ID'
    :rows-per-page-options='[20]'
    :columns='columns'
    @row-click='(ev, row, index) => onRowClick(row as delegatedstaking.DelegatedStaking)'
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
        <q-input v-model='target.ContractCodeURL' :label='$t("MSG_CONTRACT_CODE_URL")' />
        <q-input v-model='target.ContractCodeBranch' :label='$t("MSG_CONTRACT_CODE_BRANCH")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.BenefitIntervalHours' :label='$t("MSG_BENEFIT_INTERVAL_HOURS")' type='number' :min='1' />
      </q-card-section>
      <q-card-section v-show='!updating'>
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.ServiceStartAt' :updating='updating' :label='$t("MSG_SERVICE_START_AT")' />
      </q-card-section>
      <q-card-section>
        <!-- <q-select :options='goodbase.BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' /> -->
        <q-select :options='goodbase.GoodTypes' v-model='target.GoodType' :disable='updating' :label='$t("MSG_GOOD_TYPE")' />
        <q-select :options='goodbase.StartModes' v-model='target.StartMode' :label='$t("MSG_START_MODE")' />
      </q-card-section>
      <q-card-section>
        <q-toggle dense v-model='target.TestOnly' :label='$t("MSG_TEST_ONLY")' />
        <div><q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' /></div>
        <div><q-toggle dense v-model='target.Purchasable' :label='$t("MSG_PURCHASEABLE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, sdk, delegatedstaking, goodbase } from 'src/npoolstore'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

const goods = sdk.delegatedstakings

const goodName = ref('')
const displayDelegatedStakings = computed(() => {
  const name = goodName.value.toLowerCase()
  return goods.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.Name.toLowerCase().includes(name) ||
          el.GoodID.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!goods.value.length) {
    sdk.getDelegatedStakings(0, 0)
  }
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as delegatedstaking.DelegatedStaking)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: delegatedstaking.DelegatedStaking) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as delegatedstaking.DelegatedStaking
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateDelegatedStaking() : createDelegatedStaking()
}

const onCancel = () => {
  onMenuHide()
}

const createDelegatedStaking = () => {
  sdk.adminCreateDelegatedStaking(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateDelegatedStaking = () => {
  sdk.adminUpdateDelegatedStaking(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.GoodID
  },
  {
    name: 'Name',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.GoodType
  },
  {
    name: 'ContractDeploymentAddress',
    label: t('MSG_CONTRACT_DEPLOYMENT_ADDRESS'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ContractDeploymentAddress
  },
  {
    name: 'ContractCalculateAddress',
    label: t('MSG_CONTRACT_CALCULATE_ADDRESS'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ContractCalculateAddress
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.BenefitType
  },
  {
    name: 'ContractCodeURL',
    label: t('MSG_CONTRACT_CODE_URL'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ContractCodeURL
  },
  {
    name: 'ContractCodeBranch',
    label: t('MSG_CONTRACT_CODE_BRANCH'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ContractCodeBranch
  },
  {
    name: 'ContractState',
    label: t('MSG_CONTRACT_STATE'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.ContractState
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => utils.formatTime(row.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => utils.formatTime(row.CreatedAt)
  }
])

</script>

<style lang='sass' scoped>
</style>
