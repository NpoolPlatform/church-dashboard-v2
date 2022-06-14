<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REGISTRATION_INVITATIONS")'
    :rows='displayInvitations'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as RegInvitation)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='searchStr'
          :label='$t("MSG_SEARCH")'
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
        <span>{{ $t('MSG_CREATE_REGISTRATION_INVITATION') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='myUsers' v-model='inviter' :label='$t("MSG_INVITER")' />
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
  RegInvitation,
  useChurchRegInvitationStore,
  useChurchUsersStore,
  UserInfo
} from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MyInvitation extends RegInvitation {
  InviterName: string
  InviteeName: string
}

const invitation = useChurchRegInvitationStore()
const invitations = computed(() => invitation.RegInvitations.get(appID.value) ? invitation.RegInvitations.get(appID.value) : [])
const loading = ref(true)

interface MyUser {
  label: string
  value: UserInfo
}

const user = useChurchUsersStore()
const users = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) : [])
const myUsers = computed(() => Array.from(users.value as Array<UserInfo>).map((el) => {
  return {
    label: el.User.EmailAddress?.length ? el.User.EmailAddress : el.User.PhoneNO,
    value: el
  } as MyUser
}))
const inviter = computed({
  get: () => {
    const inviter = users.value?.findIndex((uel) => uel.User.ID === target.value.InviterID)
    if (inviter !== undefined && inviter >= 0) {
      const user = (users.value as Array<UserInfo>)[inviter]
      return {
        label: user.User.EmailAddress?.length ? user.User.EmailAddress : user.User.PhoneNO,
        value: user
      } as MyUser
    }
    return undefined as unknown as MyUser
  },
  set: (val) => {
    target.value.InviterID = val.value.User.ID as string
  }
})

const searchStr = ref('')
const displayInvitations = computed(() => Array.from(invitations.value as Array<RegInvitation>).map((el) => {
  const i = el as MyInvitation
  i.InviteeName = ''
  i.InviterName = ''
  const inviter = users.value?.findIndex((uel) => uel.User.ID === el.InviterID)
  if (inviter !== undefined && inviter >= 0 && users.value?.length) {
    i.InviterName = users.value[inviter].User.EmailAddress as string
    if (i.InviterName.length === 0) {
      i.InviterName = users.value[inviter].User.PhoneNO as string
    }
  }
  const invitee = users.value?.findIndex((uel) => uel.User.ID === el.InviteeID)
  if (invitee !== undefined && invitee >= 0 && users.value?.length) {
    i.InviteeName = users.value[invitee].User.EmailAddress as string
    if (i.InviteeName.length === 0) {
      i.InviteeName = users.value[invitee].User.PhoneNO as string
    }
  }
  return i
}).filter((el) => {
  return el.InviteeName?.includes(searchStr.value) ||
        el.InviterName?.includes(searchStr.value) ||
        el.InviteeID?.includes(searchStr.value) ||
        el.InviterID?.includes(searchStr.value)
}))

const prepare = () => {
  loading.value = true
  invitation.getRegInvitations({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_REGISTRATION_INVITATIONS'),
        Message: t('MSG_GET_REGISTRATION_INVITATIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })

  user.getUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const target = ref({} as unknown as RegInvitation)

const onRowClick = (coupon: RegInvitation) => {
  showing.value = true
  target.value = coupon
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as RegInvitation
}

const onSubmit = () => {
  showing.value = false
  invitation.updateRegInvitation({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_REGISTRATION_INVITATION',
        Message: 'MSG_UPDATE_REGISTRATION_INVITATION_FAIL',
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
