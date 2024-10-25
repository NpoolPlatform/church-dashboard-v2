<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TASK_CONFIG")'
    :rows='displayTaskConfigs'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedTaskConfig'
    @row-click='(evt, row, index) => onRowClick(row as inspiretaskconfig.TaskConfig)'
  >
    <template #top-right>
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
        :disable='(selectedTaskConfig.length === 0)'
        @click='onDelete'
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
        <span>{{ updating ? $t('MSG_UPDATE_TASK_CONFIG_SETTING') : $t('MSG_CREATE_TASK_CONFIG_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <EventPicker v-model:id='target.EventID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-select :options='inspiretaskconfig.TaskTypes' v-model='target.TaskType' :label='$t("MSG_TASK_TYPE")' />
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input type='number' v-model.number='target.Index' :label='$t("MSG_INDEX")' />
        <q-input type='number' v-model.number='target.MaxRewardCount' :label='$t("MSG_MAX_REWARD_COUNT")' />
        <q-input type='number' v-model.number='target.CooldownSecond' :label='$t("MSG_COOLDOWN_SECOND")' />
        <q-toggle dense v-model='target.IntervalReset' :label='$t("MSG_INTERVAL_RESET")' />
        <q-input type='number' v-model.number='target.MaxIntervalRewardCount' :label='$t("MSG_MAX_INTERVAL_REWARD_COUNT")' />
        <q-input type='number' v-model.number='target.IntervalResetSecond' :label='$t("MSG_INTERVAL_RESET_SECOND")' />
        <q-input type='text' v-model='target.TaskDesc' :label='$t("MSG_TASK_DESC")' />
        <q-input v-model='target.StepGuide' :label='$t("MSG_STEP_GUIDE")' />
        <q-input v-model='target.RecommendMessage' :label='$t("MSG_RECOMMEND_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <TaskPicker v-model:id='target.LastTaskID' :label='$t("MSG_LAST_TASK_CONFIG")' />
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
import { AppID } from 'src/npoolstore/sdk'
import { useI18n } from 'vue-i18n'
import { inspiretaskconfig, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const EventPicker = defineAsyncComponent(() => import('src/components/inspire/EventPicker.vue'))
const TaskPicker = defineAsyncComponent(() => import('src/components/inspire/TaskPicker.vue'))

const _taskconfig = inspiretaskconfig.useTaskConfigStore()
const taskconfigs = computed(() => _taskconfig.taskConfigs())

const eventid = ref('')
const displayTaskConfigs = computed(() => taskconfigs.value.filter((el) => {
  return el.EventID?.includes(eventid.value)
}))

const target = ref({} as inspiretaskconfig.TaskConfig)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as inspiretaskconfig.TaskConfig
  showing.value = true
  updating.value = false
}
const onRowClick = (row: inspiretaskconfig.TaskConfig) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as inspiretaskconfig.TaskConfig
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  console.log('1target: ', target.value)
  updating.value ? updateTaskConfig(done) : createTaskConfig(done)
}

const updateTaskConfig = (done: () => void) => {
  console.log('target: ', target.value)
  _taskconfig.adminUpdateTaskConfig({
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

const createTaskConfig = (done: () => void) => {
  _taskconfig.adminCreateTaskConfig({
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

const selectedTaskConfig = ref([] as Array<inspiretaskconfig.TaskConfig>)
const onDelete = () => {
  selectedTaskConfig.value.forEach((el) => {
    _taskconfig.adminDeleteTaskConfig({
      ID: el.ID,
      EntID: el.EntID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_TASK_CONFIG',
          Message: 'MSG_DELETE_TASK_CONFIG_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const prepare = () => {
  getTaskConfigs(0, 100)
}

onMounted(() => {
  if (!taskconfigs.value?.length) {
    getTaskConfigs(0, 100)
  }
})

watch(AppID, () => {
  target.value.AppID = AppID.value
  prepare()
})

const getTaskConfigs = (offset: number, limit: number) => {
  _taskconfig.adminGetTaskConfigs({
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
  }, (error: boolean, rows?: Array<inspiretaskconfig.TaskConfig>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getTaskConfigs(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.AppID
  },
  {
    name: 'EventID',
    label: t('MSG_EVENT_ID'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.EventID
  },
  {
    name: 'TaskType',
    label: t('MSG_TASK_TYPE'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.TaskType
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.Name
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.EventType
  },
  {
    name: 'TaskDesc',
    label: t('MSG_TASK_DESC'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.TaskDesc
  },
  {
    name: 'StepGuide',
    label: t('MSG_STEP_GUIDE'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.StepGuide
  },
  {
    name: 'RecommendMessage',
    label: t('MSG_RECOMMEND_MESSAGE'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.RecommendMessage
  },
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.Index
  },
  {
    name: 'LastTaskID',
    label: t('MSG_LAST_TASK_ID'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.LastTaskID
  },
  {
    name: 'MaxRewardCount',
    label: t('MSG_MAX_REWARD_COUNT'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.MaxRewardCount
  },
  {
    name: 'CooldownSecond',
    label: t('MSG_COOLDOWN_SECOND'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.CooldownSecond
  },
  {
    name: 'IntervalReset',
    label: t('MSG_INTERVAL_RESET'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.IntervalReset
  },
  {
    name: 'MaxIntervalRewardCount',
    label: t('MSG_MAX_INTERVAL_REWARD_COUNT'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.MaxIntervalRewardCount
  },
  {
    name: 'IntervalResetSecond',
    label: t('MSG_INTERVAL_RESET_SECOND'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => row.IntervalResetSecond
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspiretaskconfig.TaskConfig) => utils.formatTime(row.CreatedAt)
  }
])

</script>
