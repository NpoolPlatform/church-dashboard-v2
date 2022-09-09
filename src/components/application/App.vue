<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APPS")'
    :rows='(apps as never)'
    row-key='ID'
    :loading='appLoading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as App)'
    :columns='columns'
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
        <q-input v-model='target.Name' :label='$t("MSG_APPLICATION_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_APPLICATION_LOGO")' />
        <q-input v-model='target.Description' :label='$t("MSG_APPLICATION_DESCRIPTION")' type='textarea' />
        <q-select :options='recaptchaMethods' v-model='target.RecaptchaMethod' :label='$t("MSG_RECAPTCHA_METHOD")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.KycEnable' :label='$t("MSG_ENABLE_KYC")' />
        </div>
        <div>
          <q-toggle dense v-model='target.SigninVerifyEnable' :label='$t("MSG_ENABLE_SIGNIN_VERIFY")' />
        </div>
        <div>
          <q-toggle dense v-model='target.InvitationCodeMust' :label='$t("MSG_INVITATION_CODE_MUST")' />
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
  useChurchAppStore,
  NotifyType,
  App,
  useLocalUserStore,
  RecaptchaType
} from 'npool-cli-v4'
import { UpdateAppRequest } from 'npool-cli-v4/dist/store/church/appuser/app/types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: App) => row.ID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    field: (row: App) => row.Name
  },
  {
    name: 'Description',
    label: t('MSG_DESCRIPTION'),
    field: (row: App) => row.Description
  },
  {
    name: 'InvitationCodeMust',
    label: t('MSG_INVITATIONCODEMUST'),
    field: (row: App) => row.InvitationCodeMust
  },
  {
    name: 'KycEnable',
    label: t('MSG_KYC_ENABLE'),
    field: (row: App) => row.KycEnable
  },
  {
    name: 'RecaptchaMethod',
    label: t('MSG_RECAPTCHA_METHOD'),
    field: (row: App) => row.RecaptchaMethod
  },
  {
    name: 'SigninVerifyEnable',
    label: t('MSG_SIGNIN_VERIFY_ENABLE'),
    field: (row: App) => row.SigninVerifyEnable
  },
  {
    name: 'CreatedBy',
    label: t('MSG_CREATEDBY'),
    field: (row: App) => row.CreatedBy
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: App) => row.CreatedAt
  }
])

const recaptchaMethods = ref([
  RecaptchaType.GoogleRecaptchaV3
])
const app = useChurchAppStore()
const apps = computed(() => app.Apps.Apps)
const appLoading = ref(false)

// dialog
const showing = ref(false)
const updating = ref(false)

const logined = useLocalUserStore()

const defaultAppValue = ref({ CreatedBy: logined.User?.ID } as App)
const target = ref({ ...defaultAppValue.value })

const onRowClick = (application: App) => {
  showing.value = true
  updating.value = true
  target.value = { ...application }
}
const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { ...defaultAppValue.value }
}
const onMenuHide = () => {
  showing.value = false
  target.value = { ...defaultAppValue.value }
}

const createApp = () => {
  app.createApp({
    CreatedBy: target.value.CreatedBy,
    Name: target.value.Name,
    Logo: target.value.Logo,
    Description: target.value.Description,
    SignupMethods: target.value.SignupMethods,
    KycEnable: target.value.KycEnable,
    SigninVerifyEnable: target.value.SigninVerifyEnable,
    InvitationCodeMust: target.value.InvitationCodeMust,
    RecaptchaMethod: target.value.RecaptchaMethod,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP',
        Message: 'MSG_CREATE_APP_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (app: App, error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}
const updateApp = () => {
  showing.value = false
  const request = {
    ID: target.value.ID,
    Logo: target.value.Logo,
    Description: target.value.Description,
    SignupMethods: target.value.SignupMethods,
    ExtSigninMethods: target.value.ExtSigninMethods,
    RecaptchaMethod: target.value.RecaptchaMethod,
    KycEnable: target.value.KycEnable,
    SigninVerifyEnable: target.value.SigninVerifyEnable,
    InvitationCodeMust: target.value.InvitationCodeMust,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP',
        Message: 'MSG_UPDATE_APP_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP',
        Message: 'MSG_UPDATE_APP_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  } as UpdateAppRequest
  const origin = app.getAppByID(target.value.ID)
  if (origin?.Name !== target.value.Name) { // don't send app name if not change
    request.Name = target.value.Name
  }
  app.updateApp(request, (app: App, error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}
const onSubmit = () => {
  updating.value ? updateApp() : createApp()
}

const onCancel = () => {
  showing.value = false
  updating.value = false
}

</script>
