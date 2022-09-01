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
        <q-select :options='RecaptchaMethods' v-model='target.RecaptchaMethod' :label='$t("MSG_RECAPTCHA_METHOD")' />
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
  RecaptchaMethods,
  useLoginedUserStore
} from 'npool-cli-v2'
import {
  useChurchAppStore,
  NotifyType,
  App
} from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'

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
const app = useChurchAppStore()
const apps = computed(() => app.Apps)
const appLoading = ref(false)

const logined = useLoginedUserStore()

const showing = ref(false)
const updating = ref(false)
const target = ref({
  CreatedBy: logined.LoginedUser?.User.ID
} as unknown as App)

onMounted(() => {
  app.getApps({
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: 'MSG_GET_APPS',
        Message: 'MSG_GET_APPS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const onMenuHide = () => {
  showing.value = false
  target.value = {
    CreatedBy: logined.LoginedUser?.User.ID
  } as unknown as App
}

const onRowClick = (application: App) => {
  target.value = apps.value.find((el) => el.ID === application.ID) as App
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false
  // TODO: support to create and update app
}

const onCancel = () => {
  showing.value = false
}

</script>
