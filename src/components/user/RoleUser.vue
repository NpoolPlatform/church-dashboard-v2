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
  useChurchRoleStore,
  NotifyType,
  useChurchUserStore,
  User,
  AppRoleUser,
  Role
} from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const role = useChurchRoleStore()
const roles = computed(() => role.Roles.get(appID.value) ? role.Roles.get(appID.value) : [])
const roleLoading = ref(true)
const selectedRole = ref([] as Array<Role>)

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const userLoading = ref(true)
const selectedUser = ref([] as Array<User>)

const roleUsers = computed(() => role.AppRoleUsers.get(appID.value)?.filter((el) => el.Role === selectedRole.value[0]?.Role))
const selectedRoleUser = ref([] as Array<User>)

const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: appID.value,
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
    if (error) {
      userLoading.value = false
      return
    }
    if (users.length === 0) {
      userLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const getAppRoleUsers = (offset: number, limit: number) => {
  role.getAppRoleUsers({
    TargetAppID: appID.value,
    RoleID: selectedRole.value[0]?.ID,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (users: Array<AppRoleUser>, error: boolean) => {
    if (error) {
      return
    }
    if (users.length === 0) {
      return
    }
    getAppRoleUsers(offset + limit, limit)
  })
}

const prepare = () => {
  roleLoading.value = true
  userLoading.value = true

  role.getAppRoles({
    TargetAppID: appID.value,
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLES',
        Message: 'MSG_GET_ROLES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    roleLoading.value = false
  })

  getAppUsers(0, 100)

  getAppRoleUsers(0, 100)
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
  role.createAppRoleUser({
    TargetAppID: appID.value,
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

  role.deleteAppRoleUser({
    TargetAppID: appID.value,
    RoleUserID: roleUsers.value?.[index].ID as string,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
