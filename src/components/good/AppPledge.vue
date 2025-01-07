<template>
  <q-table
    dense
    flat
    :title='$t("MSG_PLEDGES")'
    :rows='displayPledges'
    :columns='pledgeColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedPledges'
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
          :disable='selectedPledges.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_PLEDGES")'
    :rows='appPledges'
    :columns='appPledgesColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedAppPledges'
    @row-click='(ev, row, index) => onRowClick(row as apppledge.AppPledge)'
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
          :disable='selectedAppPledges.length === 0'
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
          v-model='target.GoodStartMode'
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
import { apppledge, utils, sdk, goodbase, pledge } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const goodName = ref('')
const pledges = sdk.pledges
const selectedPledges = ref([] as pledge.Pledge[])
const displayPledges = computed(() => sdk.pledges?.value?.filter((el) => {
  const _name = goodName.value?.toLowerCase()
  return el.Name.toLowerCase()?.includes(_name) || el.GoodID.toLowerCase()?.includes(_name)
}))

const name = ref('')
const appPledges = computed(() => sdk.appPledge.appPledges.value.filter((el) => {
  const _name = name.value?.toLowerCase()
  return el.AppGoodName.toLowerCase()?.includes(_name) || el.AppGoodID.toLowerCase()?.includes(_name) || el.GoodID.toLowerCase()?.includes(_name)
}))
const selectedAppPledges = ref([] as Array<apppledge.AppPledge>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as apppledge.AppPledge)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as apppledge.AppPledge
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppPledge() : createAppPledge()
}

const updateAppPledge = () => {
  sdk.appPledge.adminUpdateAppPledge(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const createAppPledge = () => {
  target.value.GoodID = selectedPledges.value?.[0]?.GoodID
  sdk.appPledge.adminCreateAppPledge(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: apppledge.AppPledge) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onUnAuthorizeClick = () => {
  sdk.appPledge.adminDeleteAppPledge(selectedAppPledges.value?.[0], () => {
    // TODO
  })
}

watch(sdk.AppID, () => {
  if (!appPledges.value.length) {
    sdk.appPledge.adminGetAppPledges(0, 0)
  }
  if (!pledges.value.length) {
    sdk.getPledges(0, 0)
  }
})

onMounted(() => {
  if (!appPledges.value.length) {
    sdk.appPledge.adminGetAppPledges(0, 0)
  }
  if (!pledges.value.length) {
    sdk.getPledges(0, 0)
  }
})

const pledgeColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: pledge.Pledge) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: pledge.Pledge) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: pledge.Pledge) => row.GoodID
  },
  {
    name: 'Title',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: pledge.Pledge) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: pledge.Pledge) => row.GoodType
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: pledge.Pledge) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: pledge.Pledge) => utils.formatTime(row.ServiceStartAt)
  }
])
const appPledgesColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.GoodType
  },
  {
    name: 'GoodOnline',
    label: t('MSG_GOOD_ONLINE'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.GoodOnline
  },
  {
    name: 'Online',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.AppGoodOnline
  },
  {
    name: 'Visible',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.Visible
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: apppledge.AppPledge) => row.BenefitType
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    sortable: true,
    field: (row: apppledge.AppPledge) => utils.formatTime(row?.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: apppledge.AppPledge) => utils.formatTime(row?.CreatedAt)
  }
])

</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
