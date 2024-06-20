<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_CONFIG")'
    :rows='displayAppConfigs'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedConfigs'
    @row-click='(evt, row, index) => onRowClick(row as inspireappconfig.AppConfig)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-toggle dense v-model='showHistory' :label='$t("MSG_SHOW_HISTORY")' size='xs' />
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

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ updating ? $t('MSG_UPDATE_APP_CONFIG_SETTING') : $t('MSG_CREATE_APP_CONFIG_SETTING') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-select :options='inspireappconfig.SettleModes' v-model='target.SettleMode' :label='$t("MSG_COMMISSION_SETTLE_MODE")' />
        <q-select :options='inspireappconfig.SettleAmountTypes' v-model='target.SettleAmountType' :label='$t("MSG_COMMISSION_SETTLE_AMOUNT_TYPE")' />
        <q-select :options='inspireappconfig.SettleIntervals' v-model='target.SettleInterval' :label='$t("MSG_COMMISSION_SETTLE_INTERVAL")' />
        <q-select :options='inspireappconfig.CommissionTypes' v-model='target.CommissionType' :label='$t("MSG_COMMISSION_TYPE")' />
        <q-input v-model='target.MaxLevel' :label='$t("MSG_MAX_LEVEL_COUNT")' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-toggle dense v-model='target.SettleBenefit' :label='$t("MSG_SETTLE_BENEFIT")' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { inspireappconfig, notify, utils, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const _appconfig = inspireappconfig.useAppConfigStore()
const appconfigs = computed(() => _appconfig.appConfigs())

const showHistory = ref(false)
const displayAppConfigs = computed(() => appconfigs.value.filter((el) => {
  let display = el.EndAt === 0
  if (showHistory.value) {
    display = el.EndAt.toString().includes('')
  }
  return display
}))

const target = ref({} as inspireappconfig.AppConfig)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as inspireappconfig.AppConfig
  showing.value = true
  updating.value = false
}
const onRowClick = (row: inspireappconfig.AppConfig) => {
  if (row.EndAt !== 0) {
    return
  }
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as inspireappconfig.AppConfig
}
const onCancel = () => {
  onMenuHide()
}

const selectedConfigs = ref([] as Array<inspireappconfig.AppConfig>)

const onSubmit = (done: () => void) => {
  updating.value ? updateAppConfig(done) : createAppConfig(done)
}

const updateAppConfig = (done: () => void) => {
  _appconfig.adminUpdateAppConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_APP_CONFIG'),
        Message: t('MSG_UPDATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_APP_CONFIG'),
        Message: t('MSG_UPDATE_APP_CONFIG_FAIL'),
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

const createAppConfig = (done: () => void) => {
  _appconfig.adminCreateAppConfig({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_APP_CONFIG'),
        Message: t('MSG_CREATE_APP_CONFIG_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_APP_CONFIG'),
        Message: t('MSG_CREATE_APP_CONFIG_FAIL'),
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

const prepare = () => {
  getAppCommissions(0, 100)
}

onMounted(() => {
  if (!appconfigs.value?.length) {
    getAppCommissions(0, 100)
  }
})

watch(AppID, () => {
  target.value.AppID = AppID.value
  prepare()
})

const getAppCommissions = (offset: number, limit: number) => {
  _appconfig.adminGetAppConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_CONFIGS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspireappconfig.AppConfig>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getAppCommissions(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.AppID
  },
  {
    name: 'SettleMode',
    label: t('MSG_SETTLE_MODE'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.SettleMode
  },
  {
    name: 'SettleAmountType',
    label: t('MSG_SETTLE_AMOUNT_TYPE'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.SettleAmountType
  },
  {
    name: 'SettleInterval',
    label: t('MSG_SETTLE_INTERVAL'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.SettleInterval
  },
  {
    name: 'CommissionType',
    label: t('MSG_COMMISSION_TYPE'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.CommissionType
  },
  {
    name: 'SettleBenefit',
    label: t('MSG_SETTLE_BENEFIT'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.SettleBenefit
  },
  {
    name: 'MaxLevel',
    label: t('MSG_MAX_LEVEL'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.MaxLevel
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.StartAt === 0 ? row.StartAt : utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => row.EndAt === 0 ? row.EndAt : utils.formatTime(row.EndAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspireappconfig.AppConfig) => utils.formatTime(row.CreatedAt)
  }
])

</script>
