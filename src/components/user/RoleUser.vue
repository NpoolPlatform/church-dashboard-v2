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
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { role, user, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _role = role.useRoleStore()
const roles = computed(() => _role.roles(AppID.value))
const roleLoading = ref(false)
const selectedRole = ref([] as Array<role.Role>)

const _user = user.useUserStore()
const appUsers = computed(() => _user.appUsers(AppID.value))
const userLoading = ref(false)
const selectedUser = ref([] as Array<user.User>)

const roleUserLoading = ref(false)
const roleUsername = ref('')
const roleUsers = computed(() => _role.roleUsers(AppID.value, selectedRole.value[0]?.EntID))
const displayRoleUsers = computed(() => roleUsers.value?.filter((el) => el.EmailAddress?.includes(roleUsername.value) || el.PhoneNO?.includes(roleUsername.value)))
const selectedRoleUser = ref([] as Array<user.User>)

const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

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

const getAppRoles = (offset: number, limit: number) => {
  _role.getAppRoles({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, roles?: Array<role.Role>) => {
    if (error || !roles?.length) {
      roleLoading.value = false
      return
    }
    getAppRoles(offset + limit, limit)
  })
}
const prepare = () => {
  if (!roles.value.length) {
    roleLoading.value = true
    getAppRoles(0, 100)
  }
  if (!appUsers.value.length) {
    userLoading.value = true
    getAppUsers(0, 500)
  }
}

watch(AppID, () => {
  prepare()
})

const getAppRoleUsers = (offset: number, limit: number) => {
  _role.getAppRoleUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    RoleID: selectedRole.value[0]?.EntID,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, roleUsers?: Array<role.AppRoleUser>) => {
    if (error || !roleUsers?.length) {
      roleUserLoading.value = false
      return
    }
    getAppRoleUsers(offset + limit, limit)
  })
}
watch(selectedRole, () => {
  if (selectedRole.value.length > 0 && !roleUsers.value.length) {
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
  _role.createAppRoleUser({
    TargetAppID: AppID.value,
    TargetUserID: selectedUser.value[0].EntID,
    RoleID: selectedRole.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_ADD_ROLE_USER',
        Message: 'MSG_ADD_ROLE_USER_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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
    ID: roleUsers.value?.[index].ID,
    TargetAppID: AppID.value,
    TargetUserID: roleUsers.value?.[index].UserID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  } as role.DeleteAppRoleUserRequest
  _role.deleteAppRoleUser(req, () => {
    // TODO
  })
}
const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
  },
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
    field: (row: user.User) => row.EntID
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
</script>
