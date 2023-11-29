<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APPS")'
    :rows='(apps as never)'
    row-key='ID'
    :loading='appLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as app.App)'
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
        <q-input v-model='target.EntID' :label='$t("MSG_ENT_ID")' />
        <q-input v-model='target.Name' :label='$t("MSG_APPLICATION_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_APPLICATION_LOGO")' />
        <q-input v-model='target.Description' :label='$t("MSG_APPLICATION_DESCRIPTION")' type='textarea' />
        <q-input v-model.number='target.MaxTypedCouponsPerOrder' :label='$t("MSG_MAX_TYPED_COUPONS_PER_ORDER")' />
        <q-input v-model='commitButtonTargets' :label='$t("MSG_COMMIT_BUTTON_TARGETS")' />
        <q-select :options='appuserbase.RecaptchaTypes' v-model='target.RecaptchaMethod' :label='$t("MSG_RECAPTCHA_METHOD")' />
        <q-select :options='appuserbase.CreateInvitationCodeWhens' v-model='target.CreateInvitationCodeWhen' :label='$t("MSG_CREATE_INVITATION_CODE_WHEN")' />
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
        <div>
          <q-toggle dense v-model='target.Maintaining' :label='$t("MSG_MAINTAINING")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_AUTHORIZE")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { user, notify, app, appuserbase } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _app = app.useApplicationStore()
const apps = computed(() => _app.apps())
const appLoading = ref(false)

const logined = user.useLocalUserStore()

const target = ref({} as app.App)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: app.App) => {
  target.value = { ...row }
  commitButtonTargets.value = row.CommitButtonTargets?.join(',')
  showing.value = true
  updating.value = true
}
const onCreate = () => {
  showing.value = true
  updating.value = false
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as app.App
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateApp(done) : createApp(done)
}

const createApp = (done: () => void) => {
  _app.createApp({
    ...target.value,
    CreatedBy: logined.User?.EntID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP',
        Message: 'MSG_CREATE_APP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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

const commitButtonTargets = ref('')
const updateApp = (done: () => void) => {
  const request = {
    ID: target.value.ID,
    EntID: target.value.EntID,
    Logo: target.value.Logo,
    Description: target.value.Description,
    SignupMethods: target.value.SignupMethods,
    ExtSigninMethods: target.value.ExtSigninMethods,
    RecaptchaMethod: target.value.RecaptchaMethod,
    KycEnable: target.value.KycEnable,
    Maintaining: target.value.Maintaining,
    CommitButtonTargets: commitButtonTargets.value?.split(','),
    SigninVerifyEnable: target.value.SigninVerifyEnable,
    InvitationCodeMust: target.value.InvitationCodeMust,
    CreateInvitationCodeWhen: target.value?.CreateInvitationCodeWhen,
    MaxTypedCouponsPerOrder: target.value?.MaxTypedCouponsPerOrder,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP',
        Message: 'MSG_UPDATE_APP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP',
        Message: 'MSG_UPDATE_APP_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  } as app.UpdateAppRequest
  const origin = _app.app(target.value.EntID)
  if (origin?.Name !== target.value.Name) { // don't send app name if not change
    request.Name = target.value.Name
  }
  _app.updateApp(request, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: app.App) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: app.App) => row.EntID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: app.App) => row.Name
  },
  {
    name: 'Description',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: app.App) => row.Description
  },
  {
    name: 'InvitationCodeMust',
    label: t('MSG_INVITATIONCODEMUST'),
    sortable: true,
    field: (row: app.App) => row.InvitationCodeMust
  },
  {
    name: 'KycEnable',
    label: t('MSG_KYC_ENABLE'),
    sortable: true,
    field: (row: app.App) => row.KycEnable
  },
  {
    name: 'RecaptchaMethod',
    label: t('MSG_RECAPTCHA_METHOD'),
    sortable: true,
    field: (row: app.App) => row.RecaptchaMethod
  },
  {
    name: 'SigninVerifyEnable',
    label: t('MSG_SIGNIN_VERIFY_ENABLE'),
    sortable: true,
    field: (row: app.App) => row.SigninVerifyEnable
  },
  {
    name: 'CreatedBy',
    label: t('MSG_CREATEDBY'),
    sortable: true,
    field: (row: app.App) => row.CreatedBy
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: app.App) => row.CreatedAt
  }
])
</script>
