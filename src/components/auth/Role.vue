<template>
  <q-table
    :title='$t("MSG_ROLES")'
    dense
    :rows='roles'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedRole'
  />
  <q-table
    :title='$t("MSG_ROLE_RESOURCES")'
    dense
    :rows='auths'
    row-key='ID'
    :rows-per-page-options='[5]'
  />
  <q-table
    :title='$t("MSG_APIS")'
    dense
    :rows='displayApis'
    row-key='ID'
    :rows-per-page-options='[20]'
    selection='single'
    v-model:selected='selectedApi'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!selectedApi' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_API') }}</span>
        </div>
        <q-input
          dense
          flat
          class='small'
          v-model='apiPath'
          :label='$t("MSG_PATH")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onCreateAuthClick'
          :disable='selectedApi.length === 0 || selectedRole.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    :title='$t("MSG_ROLE_USERS")'
    dense
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[5]'
  />
</template>

<script setup lang='ts'>
import {
  useAPIStore,
  NotificationType,
  ExpandAPI,
  useAuthStore,
  useChurchUsersStore,
  UserInfo,
  useChurchRolesStore,
  AppRole
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const role = useChurchRolesStore()
const roles = computed(() => role.Roles.get(appID.value))
const selectedRole = ref([] as Array<AppRole>)

const user = useChurchUsersStore()
const users = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<UserInfo> : [])
const displayUsers = computed(() => Array.from(users.value.filter((user) => {
  const index = user.Roles?.findIndex((el) => el.ID === selectedRole.value[0]?.ID)
  return index !== undefined && index >= 0
}).map((user) => user.User)))
const userLoading = ref(true)

const api = useAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = useAuthStore()
const auths = computed(() => auth.AppAuths.get(appID.value) ? auth.AppAuths.get(appID.value) : [])

const prepare = () => {
  auth.getAuths({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  userLoading.value = true
  user.getUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_USERS',
        Message: 'MSG_GET_APP_USERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    userLoading.value = false
  })

  role.getRoles({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_ROLES',
        Message: 'MSG_GET_APP_ROLES_FAIL',
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
  api.getAPIs({
    Message: {
      Error: {
        Title: 'MSG_GET_API',
        Message: 'MSG_GET_APIS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  prepare()
})

const onCreateAuthClick = () => {
  auth.createAppRoleAuth({
    TargetAppID: appID.value,
    Info: {
      AppID: appID.value,
      RoleID: selectedRole.value[0]?.ID,
      Resource: selectedApi.value[0].Path,
      Method: selectedApi.value[0].Method
    },
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
