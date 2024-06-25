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
    :columns='columns as never'
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
        <q-input v-if='updating' disable v-model='target.EntID' :label='$t("MSG_ENT_ID")' />
        <q-input v-if='updating' v-model='newEntID' :label='$t("MSG_NEW_ENT_ID")' />
        <q-input v-model='newName' :label='$t("MSG_APPLICATION_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_APPLICATION_LOGO")' />
        <q-input v-model='target.Description' :label='$t("MSG_APPLICATION_DESCRIPTION")' type='textarea' />
        <q-input v-model='commitButtonTargets' :label='$t("MSG_COMMIT_BUTTON_TARGETS")' />
        <q-select :options='appuserbase.RecaptchaTypes' v-model='target.RecaptchaMethod' :label='$t("MSG_RECAPTCHA_METHOD")' />
        <q-select :options='appuserbase.CreateInvitationCodeWhens' v-model='target.CreateInvitationCodeWhen' :label='$t("MSG_CREATE_INVITATION_CODE_WHEN")' />
        <q-select :options='appuserbase.ResetUserMethods' v-model='target.ResetUserMethod' :label='$t("MSG_RESET_USER_METHOD")' />
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
          <q-toggle dense v-model='target.CouponWithdrawEnable' :label='$t("MSG_COUPON_WITHDRAW_ENABLE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Maintaining' :label='$t("MSG_MAINTAINING")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { user, app, appuserbase, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const apps = sdk.applications
const appLoading = ref(false)

const logined = user.useLocalUserStore()

const target = ref({
  CreatedBy: logined.User?.EntID
} as app.App)

const newEntID = ref(undefined as unknown as string)
const newName = ref(undefined as unknown as string)
const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onRowClick = (row: app.App) => {
  target.value = { ...row }
  commitButtonTargets.value = row.CommitButtonTargets?.join(',')
  newEntID.value = target.value?.EntID
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value.ResetUserMethod = appuserbase.ResetUserMethod.Normal
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    CreatedBy: logined.User?.EntID
  } as app.App
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  updating.value ? updateApp() : createApp()
}

const createApp = () => {
  sdk.adminCreateApplication(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const commitButtonTargets = ref('')
watch(commitButtonTargets, () => {
  target.value.CommitButtonTargets = commitButtonTargets.value?.split(',')
})

const updateApp = () => {
  sdk.adminUpdateApplication(target.value, newEntID.value, newName.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

onMounted(() => {
  if (!apps.value.length) {
    sdk.getApplications(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    align: 'left',
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
    label: t('MSG_INVITATION_CODE_MUST'),
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
    name: 'CouponWithdrawEnable',
    label: t('MSG_COUPON_WITHDRAW_ENABLE'),
    sortable: true,
    field: (row: app.App) => row.CouponWithdrawEnable
  },
  {
    name: 'ResetUserMethod',
    label: t('MSG_RESET_USER_METHOD'),
    sortable: true,
    field: (row: app.App) => row.ResetUserMethod
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
