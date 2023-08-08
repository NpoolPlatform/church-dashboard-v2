<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ACTIVITYS")'
    :rows='activities'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as Activity)'
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
        <span>{{ $t('MSG_CREATE_ACTIVITY') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_ACTIVITY_NAME")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='date' v-model='end' :label='$t("MSG_END")' />
        <q-toggle v-model='target.SystemActivity' :label='$t("MSG_SYSTEM_ACTIVITY")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, Activity, useChurchActivityStore, useAdminActivityStore, formatTime } from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'
import { useLocalUserStore } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const activity = useChurchActivityStore()
const aactivity = useAdminActivityStore()
const activities = computed(() => activity.Activities.get(appID.value) ? activity.Activities.get(appID.value) : [])
const loading = ref(true)

const logined = useLocalUserStore()

const prepare = () => {
  loading.value = true
  activity.getActivities({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_ACTIVITIES'),
        Message: t('MSG_GET_ACTIVITIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({
  CreatedBy: logined.User?.ID
} as unknown as Activity)
const start = computed({
  get: () => formatTime(target.value.Start, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.Start = new Date(val).getTime() / 1000
  }
})
const end = computed({
  get: () => formatTime(target.value.End, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.End = new Date(val).getTime() / 1000
  }
})

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (activity: Activity) => {
  showing.value = true
  updating.value = true
  target.value = activity
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Activity
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    aactivity.updateActivity({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_ACTIVITY',
          Message: 'MSG_UPDATE_ACTIVITY_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  activity.createActivity({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ACTIVITY',
        Message: 'MSG_CREATE_ACTIVITY_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
