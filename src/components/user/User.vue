<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='appUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[100]'
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
        <span>{{ $t('MSG_CREATE_ROLE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.EmailAddress' :label='$t("MSG_EMAIL_ADDRESS")' />
        <q-input v-model='target.PhoneNO' :label='$t("MSG_PHONENO")' />
        <q-input v-model='password' :label='$t("MSG_PASSWORD")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { notify, user, utils } from 'src/npoolstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _user = user.useUserStore()
const appUsers = computed(() => _user.appUsers(undefined))
const userLoading = ref(false)
const password = ref('')

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
  }, (error: boolean, users?: Array<user.User>) => {
    if (error || !users?.length) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const prepare = () => {
  if (appUsers.value.length === 0) {
    userLoading.value = true
    getAppUsers(0, 500)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: user.User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
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

const showing = ref(false)
const onCreate = () => {
  showing.value = true
}

const target = ref({
  TargetAppID: AppID
} as unknown as user.User)

const onMenuHide = () => {
  showing.value = false
  target.value = {
    TargetAppID: AppID
  } as unknown as user.User
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  showing.value = false

  _user.createAppUser({
    TargetAppID: AppID.value,
    EmailAddress: target.value.EmailAddress,
    PhoneNO: target.value.PhoneNO,
    PasswordHash: utils.encryptPassword(password.value),
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_USER',
        Message: 'MSG_CREATE_APP_USER',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
