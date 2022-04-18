<template>
  <q-table
    :title='$t("MSG_APP_RESOURCES")'
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
          :disable='selectedApi.length === 0'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { useAPIStore, NotificationType, ExpandAPI, useAuthStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref } from 'vue'

const app = useLocalApplicationStore()

const api = useAPIStore()
const apis = computed(() => api.APIs)
const selectedApi = ref([] as Array<ExpandAPI>)
const apiPath = ref('')
const displayApis = computed(() => apis.value.filter((api) => api.Path.includes(apiPath.value)))

const auth = useAuthStore()
const auths = computed(() => auth.AppAuths.get(app.AppID) ? auth.AppAuths.get(app.AppID) : [])

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

  auth.getAuths({
    TargetAppID: app.AppID,
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
})

const onCreateAuthClick = () => {
  auth.createAppAuth({
    TargetAppID: app.AppID,
    Info: {
      AppID: app.AppID,
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
