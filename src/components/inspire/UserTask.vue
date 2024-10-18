<template>
  <q-table
    :title='$t("MSG_USERS")'
    dense
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[25]'
    selection='single'
    v-model:selected='selectedUser'
    :loading='userLoading'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_USER_REWARDS")'
    :rows='displayUserTasks'
    :loading='loading'
    row-key='ID'
    :columns='userTaskColumns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='taskname'
        :label='$t("MSG_TASK_NAME")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { AppID } from 'src/npoolstore/sdk'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watch } from 'vue'
import { user, inspiretask, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(AppID.value))
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => el.EmailAddress?.toLowerCase()?.includes(username.value?.toLowerCase()) || el.PhoneNO?.toLowerCase()?.includes(username.value?.toLowerCase())))
const selectedUser = ref([] as Array<user.User>)
const userLoading = ref(false)

const _usertask = inspiretask.useUserTaskStore()
const _usertasks = computed(() => _usertask.userTasks())

const taskname = ref('')
const displayUserTasks = computed(() => _usertasks.value.filter((el) => {
  return el.Name?.toLowerCase()?.includes(taskname.value?.toLowerCase())
}))

const loading = ref(false)

const prepare = () => {
  getAppUsers(0, 100)
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (users.value.length === 0) {
    getAppUsers(0, 100)
  }
})

const getAppUsers = (offset: number, limit: number) => {
  _user.getAppUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<user.User>) => {
    if (error || !rows?.length) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

watch(selectedUser, () => {
  if (selectedUser.value.length === 0) {
    return
  }
  getUserTasks(0, 100)
})

const getUserTasks = (offset: number, limit: number) => {
  _usertask.adminGetTasks({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value[0]?.EntID,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USER_TASKS',
        Message: 'MSG_GET_USER_TASKS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspiretask.UserTask>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getUserTasks(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: user.User) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: user.User) => row.AppID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: user.User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: user.User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: user.User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: user.User) => utils.formatTime(row.CreatedAt)
  }
])

const userTaskColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.AppID
  },
  {
    name: 'EventID',
    label: t('MSG_EVENT_ID'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.EventID
  },
  {
    name: 'TaskType',
    label: t('MSG_TASK_TYPE'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.TaskType
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.Name
  },
  {
    name: 'TaskState',
    label: t('MSG_TASK_STATE'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.TaskState
  },
  {
    name: 'RewardState',
    label: t('MSG_REWARD_STATE'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.RewardState
  },
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.Index
  },
  {
    name: 'MaxRewardCount',
    label: t('MSG_MAX_REWARD_COUNT'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.MaxRewardCount
  },
  {
    name: 'CooldownSecord',
    label: t('MSG_COOLDOWN_SECORD'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.CooldownSecord
  },
  {
    name: 'CompletionTimes',
    label: t('MSG_COMPLETION_TIMES'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.CompletionTimes
  },
  {
    name: 'NextStartAt',
    label: t('MSG_NEXT_START_AT'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.NextStartAt === 0 ? row.NextStartAt : utils.formatTime(row.NextStartAt)
  },
  {
    name: 'LastTaskID',
    label: t('MSG_LAST_TASK_ID'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.LastTaskID
  },
  {
    name: 'TaskDesc',
    label: t('MSG_TASK_DESC'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.TaskDesc
  },
  {
    name: 'StepGuide',
    label: t('MSG_STEP_GUIDE'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.StepGuide
  },
  {
    name: 'RecommendMessage',
    label: t('MSG_RECOMMEND_MESSAGE'),
    sortable: true,
    field: (row: inspiretask.UserTask) => row.RecommendMessage
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspiretask.UserTask) => utils.formatTime(row.CreatedAt)
  }
])

</script>
