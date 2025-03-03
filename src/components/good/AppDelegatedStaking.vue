<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DELEGATEDSTAKINGS")'
    :rows='displayDelegatedStakings'
    :columns='delegatedstakingColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedDelegatedStakings'
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
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedDelegatedStakings.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_DELEGATEDSTAKINGS")'
    :rows='appDelegatedStakings'
    :columns='appDelegatedStakingsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedAppDelegatedStakings'
    @row-click='(ev, row, index) => onRowClick(row as appdelegatedstaking.AppDelegatedStaking)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_GOOD_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_UNAUTHORIZE")'
          @click='onUnAuthorizeClick'
          :disable='selectedAppDelegatedStakings.length === 0'
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
        <q-input v-model='target.AppGoodName' :label='$t("MSG_GOOD_NAME")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='goodbase.StartModes'
          v-model='target.AppGoodStartMode'
          :label='$t("MSG_GOOD_START_MODE")'
        />
        <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnableSetCommission' :label='$t("MSG_ENABLE_SET_COMMISSION")' /></div>
        <div><q-toggle dense v-model='target.AppGoodPurchasable' :label='$t("MSG_ENABLE_PURCHASE")' /></div>
        <div><q-toggle dense v-model='target.EnableProductPage' :label='$t("MSG_ENABLE_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' /></div>
        <div><q-toggle dense v-model='target.AppGoodOnline' :label='$t("MSG_ONLINE")' /></div>
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
import { useI18n } from 'vue-i18n'
import { appdelegatedstaking, utils, sdk, goodbase, delegatedstaking } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const goodName = ref('')
const delegatedstakings = sdk.delegatedstakings
const selectedDelegatedStakings = ref([] as delegatedstaking.DelegatedStaking[])
const displayDelegatedStakings = computed(() => sdk.delegatedstakings?.value?.filter((el) => {
  const _name = goodName.value?.toLowerCase()
  return el.Name.toLowerCase()?.includes(_name) || el.GoodID.toLowerCase()?.includes(_name)
}))

const name = ref('')
const appDelegatedStakings = computed(() => sdk.appDelegatedStaking.appDelegatedStakings.value.filter((el) => {
  const _name = name.value?.toLowerCase()
  return el.AppGoodName.toLowerCase()?.includes(_name) || el.AppGoodID.toLowerCase()?.includes(_name) || el.GoodID.toLowerCase()?.includes(_name)
}))
const selectedAppDelegatedStakings = ref([] as Array<appdelegatedstaking.AppDelegatedStaking>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appdelegatedstaking.AppDelegatedStaking)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appdelegatedstaking.AppDelegatedStaking
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppDelegatedStaking() : createAppDelegatedStaking()
}

const updateAppDelegatedStaking = () => {
  sdk.appDelegatedStaking.adminUpdateAppDelegatedStaking(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const createAppDelegatedStaking = () => {
  target.value.GoodID = selectedDelegatedStakings.value?.[0]?.GoodID
  sdk.appDelegatedStaking.adminCreateAppDelegatedStaking(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appdelegatedstaking.AppDelegatedStaking) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onUnAuthorizeClick = () => {
  sdk.appDelegatedStaking.adminDeleteAppDelegatedStaking(selectedAppDelegatedStakings.value?.[0], () => {
    // TODO
  })
}

watch(sdk.AppID, () => {
  if (!appDelegatedStakings.value.length) {
    sdk.appDelegatedStaking.adminGetAppDelegatedStakings(0, 0)
  }
  if (!delegatedstakings.value.length) {
    sdk.getDelegatedStakings(0, 0)
  }
})

onMounted(() => {
  if (!appDelegatedStakings.value.length) {
    sdk.appDelegatedStaking.adminGetAppDelegatedStakings(0, 0)
  }
  if (!delegatedstakings.value.length) {
    sdk.getDelegatedStakings(0, 0)
  }
})

const delegatedstakingColumns = computed(() => [
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
    name: 'Title',
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
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.BenefitType
  },
  {
    name: 'StartMode',
    label: t('MSG_STARTMODE'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => row.StartMode
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: delegatedstaking.DelegatedStaking) => utils.formatTime(row.ServiceStartAt)
  }
])
const appDelegatedStakingsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.GoodType
  },
  {
    name: 'GoodOnline',
    label: t('MSG_GOOD_ONLINE'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.GoodOnline
  },
  {
    name: 'Online',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.AppGoodOnline
  },
  {
    name: 'Visible',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.Visible
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => row.BenefitType
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => utils.formatTime(row?.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appdelegatedstaking.AppDelegatedStaking) => utils.formatTime(row?.CreatedAt)
  }
])

</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
