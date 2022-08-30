<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='appUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[20]'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, useChurchUserStore, User } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const userLoading = ref(true)

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

const prepare = () => {
  userLoading.value = true
  getAppUsers(0, 100)
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
