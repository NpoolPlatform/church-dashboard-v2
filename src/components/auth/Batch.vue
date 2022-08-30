<template>
  <q-table
    :title='$t("MSG_APP_RESOURCES")'
    dense
    :rows='displayAuths'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='authPath'
          :label='$t("MSG_PATH")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExportClick'
        />
      </div>
    </template>
  </q-table>
  <q-table
    :title='$t("MSG_LOADED_APP_RESOURCES")'
    dense
    :rows='displayLoadedAuths'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='loadedPath'
          :label='$t("MSG_PATH")'
        />
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='onFileLoaded'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_LOAD_FILE")'
          @click='onLoadFileClick'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SUBMIT")'
          @click='onSubmitClick'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { saveAs } from 'file-saver'
import { Auth, formatTime, NotificationType, useAuthStore } from 'npool-cli-v2'
import { useChurchAppStore, App } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)
const application = useChurchAppStore()

const auth = useAuthStore()
const auths = computed(() => auth.getAuthsByApp(appID.value))
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))

const loadedAuths = ref([] as Array<Auth>)
const loadedPath = ref('')
const displayLoadedAuths = computed(() => loadedAuths.value?.filter((auth) => auth.Resource.includes(loadedPath.value)))

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
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

interface SavedAuths {
  Application: App
  Auths: Array<Auth>
}

const onExportClick = () => {
  const myApp = application.Apps.find((el) => el.ID === appID.value)
  const blob = new Blob([JSON.stringify({
    Application: myApp,
    Auths: auths.value
  })], { type: 'text/plain;charset=utf-8' })
  const filename = (myApp?.Name as string) + '-' +
                   (myApp?.ID as string) + '-auths-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.json'
  saveAs(blob, filename)
}

const loadFileButton = ref<HTMLInputElement>()

const onLoadFileClick = () => {
  loadFileButton.value?.click()
}

const onFileLoaded = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const loaded = JSON.parse(reader.result as string) as SavedAuths
      const index = application.Apps.findIndex((el) => el.ID === loaded.Application.ID)
      application.Apps.splice(index, index < 0 ? 0 : 1, loaded.Application)
      app.AppID = loaded.Application.ID
      loadedAuths.value = loaded.Auths
    }
    reader.readAsText(filename)
  }
}

const onSubmitClick = () => {
  loadedAuths.value.forEach((a) => {
    if (a.UserID.length > 0) {
      auth.createAppUserAuth({
        TargetAppID: a.AppID,
        TargetUserID: a.UserID,
        Info: a,
        Message: {
          Error: {
            Title: 'MSG_CREATE_APP_USER_AUTH',
            Message: 'MSG_CREATE_APP_USER_AUTH_FAIL',
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        // TODO
      })
      return
    }

    if (a.RoleID.length > 0) {
      auth.createAppRoleAuth({
        TargetAppID: a.AppID,
        Info: a,
        Message: {
          Error: {
            Title: 'MSG_CREATE_APP_ROLE_AUTH',
            Message: 'MSG_CREATE_APP_ROLE_AUTH_FAIL',
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        // TODO
      })
      return
    }

    auth.createAppAuth({
      TargetAppID: a.AppID,
      Info: a,
      Message: {
        Error: {
          Title: 'MSG_CREATE_APP_AUTH',
          Message: 'MSG_CREATE_APP_AUTH_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

</script>
