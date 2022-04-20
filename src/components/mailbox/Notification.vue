<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MAILS")'
    :rows='notifications'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Notification)'
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
        <q-select :options='users' v-model='selectedUser' :label='$t("MSG_USER")' />
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
  useChurchMailboxStore,
  NotificationType,
  Notification,
  useAdminMailboxStore,
  useChurchUsersStore,
  AppUser,
  UserInfo
} from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUsersStore()

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
const selectedUser = ref(undefined as unknown as MyUser)

const mailbox = useChurchMailboxStore()
const amailbox = useAdminMailboxStore()
const notifications = computed(() => mailbox.Notifications.get(appID.value) ? mailbox.Notifications.get(appID.value) : [])
const loading = ref(true)

const prepare = () => {
  loading.value = true
  mailbox.getNotifications({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_NOTIFICATIONS'),
        Message: t('MSG_GET_NOTIFICATIONS_FAIL'),
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
const target = ref({} as unknown as Notification)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (notif: Notification) => {
  showing.value = true
  updating.value = true
  target.value = notif
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Notification
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    amailbox.updateNotification({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_NOTIFICATION',
          Message: 'MSG_UPDATE_NOTIFICATION_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  mailbox.createNotification({
    TargetAppID: appID.value,
    TargetUserID: selectedUser.value.value.ID as string,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_NOTIFICATION',
        Message: 'MSG_CREATE_NOTIFICATION_FAIL',
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
