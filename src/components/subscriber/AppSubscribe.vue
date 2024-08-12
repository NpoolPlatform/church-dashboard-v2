<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_SUBSCRIBE")'
    :rows='appSubscribes'
    row-key='ID'
    :rows-per-page-options='[100]'
    v-model:selected='selectedAppSubscribe'
    selection='single'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
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
        <span>{{ $t('MSG_CREATE_APP_SUBSCRIBE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='apps' v-model='targetApp' :label='$t("MSG_TARGET_APP")' :option-label='item => item.ID + "|" + item.Name' />
        <q-select :options='apps' v-model='subscribeApp' :label='$t("MSG_SUBSCRIBE_APP")' :option-label='item => item.ID + "|" + item.Name' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, watch, ref } from 'vue'
import { appsubscribe, app, notify, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const appSubscribe = appsubscribe.useAppSubscribeStore()
const appSubscribes = computed(() => appSubscribe.AppSubscribes.get(AppID.value) ? appSubscribe.AppSubscribes.get(AppID.value) : [])

const apps = sdk.applications

const targetApp = ref(undefined as unknown as app.App)
const subscribeApp = ref(undefined as unknown as app.App)
const selectedAppSubscribe = ref([] as Array<appsubscribe.AppSubscribe>)

const prepare = () => {
  appSubscribe.getAppSubscribes({
    TargetAppID: AppID.value,
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_SUBSCRIBERS',
        Message: 'MSG_GET_EMAIL_SUBSCRIBERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  if (!apps.value.length) {
    sdk.getApplications(0, 0)
  }
  prepare()
})

const onCreate = () => {
  showing.value = true
}

const onDelete = () => {
  selectedAppSubscribe.value.forEach((el) => {
    appSubscribe.deleteAppSubscribe({
      ID: el.ID,
      EntID: el.EntID,
      TargetAppID: el.AppID,
      Message: {
        Error: {
          Title: 'MSG_CREATE_APP_SUBSCRIBE',
          Message: 'MSG_CREATE_APP_SUBSCRIBE_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const showing = ref(false)
const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false
  if (!targetApp.value || !subscribeApp.value) {
    return
  }
  appSubscribe.createAppSubscribe({
    TargetAppID: targetApp.value.EntID,
    SubscribeAppID: subscribeApp.value.EntID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_SUBSCRIBE',
        Message: 'MSG_CREATE_APP_SUBSCRIBE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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
