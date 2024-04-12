<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COMMISSION_CONFIG")'
    :rows='displayCommissions'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedConfigs'
    @row-click='(evt, row, index) => onRowClick(row as appcommissionconfig.AppCommissionConfig)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-toggle dense v-model='showAppHistory' :label='$t("MSG_SHOW_HISTORY")' size='xs' />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_COMMISSION_CONFIG")'
    :rows='displayGoodCommissions'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns2'
    v-model:selected='selectedGoodConfigs'
    @row-click='(evt, row, index) => onRowClick2(row as appgoodcommissionconfig.AppGoodCommissionConfig)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='appGoodID'
          :label='$t("MSG_APP_GOOD_ID")'
        />
        <q-toggle dense v-model='showAppGoodHistory' :label='$t("MSG_SHOW_HISTORY")' size='xs' />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate2'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ updating ? $t('MSG_UPDATE_APP_COMMISSION_SETTING') : $t('MSG_CREATE_APP_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-select :options='appcommissionconfig.SettleTypes' v-model='target.SettleType' :label='$t("MSG_COMMISSION_SETTLE_TYPE")' />
        <q-input v-model='target.AmountOrPercent' :label='$t("MSG_AMOUNT_OR_PERCENT")' suffix='$ | %' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Level' :label='$t("MSG_LEVEL")' />
        <q-input v-model='target.ThresholdAmount' :label='$t("MSG_THRESHOLD")' suffix='$' />
        <q-input v-model='target.Invites' :label='$t("MSG_INVITES")' />
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
        <q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLED")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model='showing2'
    @hide='onMenuHide2'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ updating2 ? $t('MSG_UPDATE_APP_GOOD_COMMISSION_SETTING') : $t('MSG_CREATE_APP_GOOD_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating2'>
        <AppGoodSelector v-model:id='target2.AppGoodID' />
      </q-card-section>
      <q-card-section v-if='!updating2'>
        <q-select :options='appcommissionconfig.SettleTypes' v-model='target2.SettleType' :label='$t("MSG_COMMISSION_SETTLE_TYPE")' />
        <q-input v-model='target2.AmountOrPercent' :label='$t("MSG_AMOUNT_OR_PERCENT")' suffix='$ | %' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target2.Level' :label='$t("MSG_LEVEL")' />
        <q-input v-model='target2.ThresholdAmount' :label='$t("MSG_THRESHOLD")' suffix='$' />
        <q-input v-model='target2.Invites' :label='$t("MSG_INVITES")' />
        <DateTimePicker v-model:date='target2.StartAt' label='MSG_START_AT' />
        <q-toggle dense v-model='target2.Disabled' :label='$t("MSG_DISABLED")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit2' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel2' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { AppID } from 'src/api/app'
import { useI18n } from 'vue-i18n'
import { appcommissionconfig, appgoodcommissionconfig, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const _commconfig = appcommissionconfig.useAppCommissionConfigStore()
const commconfigs = computed(() => _commconfig.appCommissionConfigs())

const _commgoodconfig = appgoodcommissionconfig.useAppGoodCommissionConfigStore()
const commgoodconfigs = computed(() => _commgoodconfig.appGoodCommissionConfigs())

const showAppHistory = ref(false)
const displayCommissions = computed(() => commconfigs.value.filter((el) => {
  let display = el.EndAt === 0
  if (showAppHistory.value) {
    display = el.EndAt.toString().includes('')
  }
  return display
}))

const appGoodID = ref('')
const showAppGoodHistory = ref(false)
const displayGoodCommissions = computed(() => commgoodconfigs.value.filter((el) => {
  let display = el.EndAt === 0
  if (showAppGoodHistory.value) {
    display = el.EndAt.toString().includes('') && el.AppGoodID.includes(appGoodID.value)
  }
  return display && el.AppGoodID.includes(appGoodID.value)
}))

const target = ref({} as appcommissionconfig.AppCommissionConfig)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as appcommissionconfig.AppCommissionConfig
  showing.value = true
  updating.value = false
}
const onRowClick = (row: appcommissionconfig.AppCommissionConfig) => {
  if (row.EndAt !== 0) {
    return
  }
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as appcommissionconfig.AppCommissionConfig
}
const onCancel = () => {
  onMenuHide()
}

const selectedConfigs = ref([] as Array<appcommissionconfig.AppCommissionConfig>)
const selectedGoodConfigs = ref([] as Array<appgoodcommissionconfig.AppGoodCommissionConfig>)

const target2 = ref({} as appgoodcommissionconfig.AppGoodCommissionConfig)
const showing2 = ref(false)
const updating2 = ref(false)

const onCreate2 = () => {
  target2.value = {} as appgoodcommissionconfig.AppGoodCommissionConfig
  showing2.value = true
  updating2.value = false
}
const onRowClick2 = (row: appgoodcommissionconfig.AppGoodCommissionConfig) => {
  if (row.EndAt !== 0) {
    return
  }
  target2.value = { ...row }
  showing2.value = true
  updating2.value = true
}
const onMenuHide2 = () => {
  showing2.value = false
  target2.value = {} as appgoodcommissionconfig.AppGoodCommissionConfig
}
const onCancel2 = () => {
  onMenuHide2()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppCommissionConfig(done) : createAppCommissionConfig(done)
}

const onSubmit2 = (done: () => void) => {
  updating2.value ? updateAppGoodCommissionConfig(done) : createAppGoodCommissionConfig(done)
}

const updateAppCommissionConfig = (done: () => void) => {
  _commconfig.updateNAppCommissionConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_APP_COMMISSION_CONFIG'),
        Message: t('MSG_UPDATE_APP_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_APP_COMMISSION_CONFIG'),
        Message: t('MSG_UPDATE_APP_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}
const createAppCommissionConfig = (done: () => void) => {
  _commconfig.createNAppCommissionConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_APP_COMMISSION_CONFIG'),
        Message: t('MSG_CREATE_APP_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_APP_COMMISSION_CONFIG'),
        Message: t('MSG_CREATE_APP_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
    prepare()
  })
}

const updateAppGoodCommissionConfig = (done: () => void) => {
  _commgoodconfig.updateNAppGoodCommissionConfig({
    TargetAppID: AppID.value,
    ...target2.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_APP_GOOD_COMMISSION_CONFIG'),
        Message: t('MSG_UPDATE_APP_GOOD_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_APP_GOOD_COMMISSION_CONFIG'),
        Message: t('MSG_UPDATE_APP_GOOD_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide2()
  })
}
const createAppGoodCommissionConfig = (done: () => void) => {
  _commgoodconfig.createNAppGoodCommissionConfig({
    TargetAppID: AppID.value,
    ...target2.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_APP_GOOD_COMMISSION_CONFIG'),
        Message: t('MSG_CREATE_APP_GOOD_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_APP_GOOD_COMMISSION_CONFIG'),
        Message: t('MSG_CREATE_APP_GOOD_COMMISSION_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide2()
    prepare()
  })
}

const prepare = () => {
  getAppCommissions(0, 100)
  getAppGoodCommissions(0, 100)
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (!commconfigs.value?.length) {
    getAppCommissions(0, 100)
  }
  if (!commgoodconfigs.value?.length) {
    getAppGoodCommissions(0, 100)
  }
})

const getAppCommissions = (offset: number, limit: number) => {
  _commconfig.getNAppCommissionConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_COMMISSION_CONFIGS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcommissionconfig.AppCommissionConfig>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getAppCommissions(offset + limit, limit)
  })
}

const getAppGoodCommissions = (offset: number, limit: number) => {
  _commgoodconfig.getNAppGoodCommissionConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOOD_COMMISSION_CONFIGS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appgoodcommissionconfig.AppGoodCommissionConfig>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getAppGoodCommissions(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.AppID
  },
  {
    name: 'SettleType',
    label: t('MSG_SETTLE_TYPE'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.SettleType
  },
  {
    name: 'Level',
    label: t('MSG_LEVEL'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.Level
  },
  {
    name: 'AmountOrPercent',
    label: t('MSG_AMOUNT_OR_PERCENT'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.AmountOrPercent
  },
  {
    name: 'ThresholdAmount',
    label: t('MSG_THRESHOLD_AMOUNT'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.ThresholdAmount
  },
  {
    name: 'Invites',
    label: t('MSG_INVITES'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.Invites
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.StartAt === 0 ? row.StartAt : utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.EndAt === 0 ? row.EndAt : utils.formatTime(row.EndAt)
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appcommissionconfig.AppCommissionConfig) => utils.formatTime(row.CreatedAt)
  }
])

const columns2 = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.AppID
  },
  {
    name: 'SettleType',
    label: t('MSG_SETTLE_TYPE'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.SettleType
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.AppGoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.GoodName
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.CoinLogo
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.CoinLogo
  },
  {
    name: 'Level',
    label: t('MSG_LEVEL'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.Level
  },
  {
    name: 'AmountOrPercent',
    label: t('MSG_AMOUNT_OR_PERCENT'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.AmountOrPercent
  },
  {
    name: 'ThresholdAmount',
    label: t('MSG_THRESHOLD_AMOUNT'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.ThresholdAmount
  },
  {
    name: 'Invites',
    label: t('MSG_INVITES'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.Invites
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.StartAt === 0 ? row.StartAt : utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.EndAt === 0 ? row.EndAt : utils.formatTime(row.EndAt)
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgoodcommissionconfig.AppGoodCommissionConfig) => utils.formatTime(row.CreatedAt)
  }
])

</script>
