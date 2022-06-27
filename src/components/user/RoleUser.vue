<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLE_USERS")'
    :rows='roleUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedRoleUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDeleteRoleUser'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedRole'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_ADD")'
          @click='onAddRoleUser'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import {
  AppRole,
  AppRoleUser,
  AppUser,
  NotificationType,
  useChurchRolesStore,
  useChurchUsersStore,
  UserInfo,
  useRoleStore
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const arole = useRoleStore()
const role = useChurchRolesStore()
const roles = computed(() => role.Roles.get(appID.value) ? role.Roles.get(appID.value) : [])
const roleLoading = ref(true)
const selectedRole = ref([] as Array<AppRole>)

const user = useChurchUsersStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<UserInfo> : [])
const users = computed(() => Array.from(appUsers.value.filter((user: UserInfo) => {
  if (!user.Roles) {
    return true
  }
  if (selectedRole.value.length === 0) {
    return true
  }
  return user.Roles.findIndex((role) => role.ID === selectedRole.value[0].ID) < 0
})).map((el) => el.User))
const userLoading = ref(true)
const selectedUser = ref([] as Array<AppUser>)

const appRoleUsers = computed(() => role.RoleUsers.get(appID.value) ? role.RoleUsers.get(appID.value) as Array<AppRoleUser> : [])

const roleUsers = computed(() => {
  if (selectedRole.value.length === 0) {
    return [] as Array<AppUser>
  }
  const curUsers = appRoleUsers.value.filter((roleUser) => roleUser.RoleID === selectedRole.value[0].ID)
  return Array.from(appUsers.value.filter((user) => curUsers.findIndex((u) => u.UserID === user.User.ID) >= 0)).map((el) => el.User)
})
const selectedRoleUser = ref([] as Array<AppUser>)

const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const prepare = () => {
  roleLoading.value = true
  userLoading.value = true

  role.getRoles({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLES',
        Message: 'MSG_GET_ROLES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    roleLoading.value = false
  })

  user.getUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    userLoading.value = false
  })

  role.getRoleUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
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

const onAddRoleUser = () => {
  if (selectedRole.value.length === 0 || selectedUser.value.length === 0) {
    return
  }
  role.createRoleUser({
    TargetAppID: appID.value,
    TargetUserID: selectedUser.value[0].ID as string,
    Info: {
      AppID: appID.value,
      RoleID: selectedRole.value[0].ID as string,
      UserID: selectedUser.value[0].ID
    },
    Message: {
      Error: {
        Title: 'MSG_ADD_ROLE_USER',
        Message: 'MSG_ADD_ROLE_USER_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteRoleUser = () => {
  if (selectedRoleUser.value.length === 0) {
    return
  }

  const index = appRoleUsers.value.findIndex((el) => el.UserID === selectedRoleUser.value[0].ID)
  if (index < 0) {
    return
  }

  arole.deleteRoleUser({
    ID: appRoleUsers.value[index].ID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
