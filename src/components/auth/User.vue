<template>
  <q-table
    :title='$t("MSG_USERS")'
    dense
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[5]'
    selection='single'
    v-model:selected='selectedUser'
    :loading='userLoading'
  />
  <q-table
    :title='$t("MSG_USER_RESOURCES")'
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
          :disable='selectedApi.length === 0 || selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { useAPIStore, NotificationType, ExpandAPI, useAuthStore, useChurchUsersStore, UserInfo, AppUser } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUsersStore()
const users = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<UserInfo> : [])
const username = ref('')
const displayUsers = computed(() => Array.from(users.value.filter((user) => {
  return user.User.EmailAddress?.includes(username.value) || user.User.PhoneNO?.includes(username.value)
}).map((user) => user.User)))
const selectedUser = ref([] as Array<AppUser>)
const userLoading = ref(true)

const api = useAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = useAuthStore()
const auths = computed(() => {
  return auth.UserAuths.get(selectedUser.value[0]?.ID as string) ? auth.AppAuths.get(selectedUser.value[0]?.ID as string) : []
})

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
  auth.createAppUserAuth({
    TargetAppID: appID.value,
    TargetUserID: selectedUser.value[0]?.ID as string,
    Info: {
      AppID: appID.value,
      UserID: selectedUser.value[0]?.ID as string,
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
