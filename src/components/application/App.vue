<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APPS")'
    :rows='apps'
    row-key='ID'
    :loading='appLoading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as App)'
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
        <span>{{ $t('MSG_CREATE_APPLICATION') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.App.Name' :label='$t("MSG_APPLICATION_NAME")' />
        <q-input v-model='target.App.Logo' :label='$t("MSG_APPLICATION_LOGO")' />
        <q-input v-model='target.App.Description' :label='$t("MSG_APPLICATION_DESCRIPTION")' type='textarea' />
        <q-select :options='RecaptchaMethods' v-model='target.Ctrl.RecaptchaMethod' :label='$t("MSG_RECAPTCHA_METHOD")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Ctrl.KycEnable' :label='$t("MSG_ENABLE_KYC")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Ctrl.SigninVerifyEnable' :label='$t("MSG_ENABLE_SIGNIN_VERIFY")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Ctrl.InvitationCodeMust' :label='$t("MSG_INVITATION_CODE_MUST")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  useApplicationsStore,
  App,
  Application,
  AppControl,
  RecaptchaMethods,
  useLoginedUserStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const app = useApplicationsStore()
const apps = computed(() => Array.from(app.Applications).map((el) => el.App))
const appLoading = ref(false)

const logined = useLoginedUserStore()

const showing = ref(false)
const updating = ref(false)
const target = ref({
  App: {
    CreatedBy: logined.LoginedUser?.User.ID
  } as unknown as App,
  Ctrl: {} as unknown as AppControl
} as unknown as Application)

onMounted(() => {
  app.getApplications({
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appLoading.value = false
  })
})

const onMenuHide = () => {
  showing.value = false
  target.value = {
    App: {
      CreatedBy: logined.LoginedUser?.User.ID
    } as unknown as App,
    Ctrl: {} as unknown as AppControl
  } as unknown as Application
}

const onRowClick = (application: App) => {
  target.value = app.getApplicationByID(application.ID)
  if (!target.value.Ctrl) {
    target.value.Ctrl = {} as unknown as AppControl
  }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    app.updateApplication({
      Info: target.value.App,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_APPLICATION',
          Message: 'MSG_UPDATE_APPLICATION_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  } else {
    app.createApplication({
      Info: target.value.App,
      Message: {
        Error: {
          Title: 'MSG_CREATE_APPLICATION',
          Message: 'MSG_CREATE_APPLICATION_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (target.value.Ctrl?.ID?.length) {
    app.updateAppCtrl({
      Info: target.value.Ctrl,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_APPLICATION_CONTROL',
          Message: 'MSG_UPDATE_APPLICATION_CONTROL_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  } else {
    app.createAppCtrl({
      TargetAppID: target.value.App.ID,
      Info: target.value.Ctrl,
      Message: {
        Error: {
          Title: 'MSG_CREATE_APPLICATION_CONTROL',
          Message: 'MSG_CREATE_APPLICATION_CONTROL_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
}

const onCancel = () => {
  showing.value = false
}

</script>
