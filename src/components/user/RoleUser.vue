<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLE_USERS")'
    :rows='displayRoleUsers'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :role-user-loading='roleUserLoading'
    v-model:selected='selectedRoleUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='roleUsername'
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
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedUser'
    :columns='columns'
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
</template>

<script setup lang='ts'>
import { AppRoleUser, formatTime, NotifyType, Role, useChurchRoleStore, useChurchUserStore, User } from 'npool-cli-v4'
import { DeleteAppRoleUserRequest } from 'npool-cli-v4/dist/store/church/appuser/role/types'
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const role = useChurchRoleStore()
const roles = computed(() => role.Roles.get(AppID.value) ? role.Roles.get(AppID.value) : [])
const roleLoading = ref(false)
const selectedRole = ref([] as Array<Role>)

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(AppID.value) ? user.Users.get(AppID.value) as Array<User> : [])
const userLoading = ref(false)
const selectedUser = ref([] as Array<User>)

const roleUserLoading = ref(false)
const roleUsername = ref('')
const roleUsers = computed(() => selectedRole.value.length > 0 ? role.AppRoleUsers.get(selectedRole.value[0].ID) : [] as Array<AppRoleUser>)
const displayRoleUsers = computed(() => roleUsers.value?.filter((el) => el.EmailAddress?.includes(roleUsername.value) || el.PhoneNO?.includes(roleUsername.value)))
const selectedRoleUser = ref([] as Array<User>)

const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (users: Array<User>, error: boolean) => {
    if (error || users.length < limit) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const getAppRoles = (offset: number, limit: number) => {
  role.getAppRoles({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (roles: Array<Role>, error: boolean) => {
    if (error || roles.length < limit) {
      roleLoading.value = false
      return
    }
    getAppRoles(offset + limit, limit)
  })
}
const prepare = () => {
  if (!role.Roles.get(AppID.value)) {
    roleLoading.value = true
    getAppRoles(0, 100)
  }
  if (!user.Users.get(AppID.value)) {
    userLoading.value = true
    getAppUsers(0, 500)
  }
}

watch(AppID, () => {
  prepare()
})

const getAppRoleUsers = (offset: number, limit: number) => {
  role.getAppRoleUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    RoleID: selectedRole.value[0]?.ID,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (roleUsers: Array<AppRoleUser>, error: boolean) => {
    if (error || roleUsers.length < limit) {
      roleUserLoading.value = false
      return
    }
    getAppRoleUsers(offset + limit, limit)
  })
}
watch(selectedRole, () => {
  if (selectedRole.value.length > 0 && !role.AppRoleUsers.get(selectedRole.value[0].ID)) {
    roleUserLoading.value = true
    getAppRoleUsers(0, 500)
  }
})
onMounted(() => {
  prepare()
})

const onAddRoleUser = () => {
  if (selectedRole.value.length === 0 || selectedUser.value.length === 0) {
    return
  }
  role.createAppRoleUser({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value[0].ID,
    RoleID: selectedRole.value[0].ID,
    Message: {
      Error: {
        Title: 'MSG_ADD_ROLE_USER',
        Message: 'MSG_ADD_ROLE_USER_FAIL',
        Popup: true,
        Type: NotifyType.Error
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

  const index = roleUsers.value?.findIndex((el) => el.ID === selectedRoleUser.value[0].ID)
  if (index === undefined || index < 0) {
    return
  }

  const req = {
    ID: roleUsers.value?.[index].ID as string,
    TargetAppID: AppID.value,
    TargetUserID: roleUsers.value?.[index].UserID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  } as DeleteAppRoleUserRequest
  role.deleteAppRoleUser(req, () => {
    // TODO
  })
}
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: User) => formatTime(row.CreatedAt)
  }
])
</script>
