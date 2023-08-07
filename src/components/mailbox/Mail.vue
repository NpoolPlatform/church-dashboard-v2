<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MAILS")'
    :rows='mails'
    row-key='ID'
    :loading='mailLoading'
    ::rows-per-page-options='[100]'
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
        <span>{{ $t('MSG_CREATE_COUNTRY') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' />
        <q-select :options='users' v-model='selectedFromUser' :label='$t("MSG_FROM_USER")' />
        <q-select :options='users' v-model='selectedToUser' :label='$t("MSG_TO_USER")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useChurchMailboxStore, NotificationType, Mail, useChurchUsersStore, AppUser, UserInfo } from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const user = useChurchUsersStore()
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const mailbox = useChurchMailboxStore()
const mails = computed(() => mailbox.Mails.get(appID.value) ? mailbox.Mails.get(appID.value) : [])
const mailLoading = ref(true)

interface MyUser {
  label: string
  value: AppUser
}

const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<UserInfo> : [])
const users = computed(() => Array.from(appUsers.value).map((el) => {
  return {
    label: el.User.EmailAddress?.length ? el.User.EmailAddress : el.User.PhoneNO,
    value: el.User
  } as MyUser
}))
const selectedFromUser = ref(undefined as unknown as MyUser)
const selectedToUser = ref(undefined as unknown as MyUser)

const prepare = () => {
  mailLoading.value = true
  mailbox.getMails({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_MAILS'),
        Message: t('MSG_GET_MAILS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    mailLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const target = ref({} as unknown as Mail)
watch(selectedFromUser, () => {
  target.value.FromUserID = selectedFromUser.value.value.ID as string
})
watch(selectedToUser, () => {
  target.value.ToUserID = selectedToUser.value.value.ID as string
})

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Mail
}

const onSubmit = () => {
  showing.value = false

  mailbox.createMail({
    TargetAppID: appID.value,
    TargetUserID: target.value.FromUserID,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_MAIL',
        Message: 'MSG_CREATE_MAIL_FAIL',
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
