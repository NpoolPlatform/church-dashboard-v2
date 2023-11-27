<template>
  <q-table
    :title='$t("MSG_APP_RESOURCES")'
    dense
    :rows='displayAuths'
    row-key='ID'
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
import { AppID } from 'src/api/app'
import { app, authing, notify, utils } from 'src/npoolstore'
import { computed, onMounted, ref, watch } from 'vue'

const application = app.useApplicationStore()

const auth = authing.useAuthingStore()
const auths = computed(() => auth.auths(AppID.value))
const authPath = ref('')
const displayAuths = computed(() => auths.value?.filter((auth) => auth.Resource.includes(authPath.value)))

const loadedAuths = ref([] as Array<authing.Auth>)
const loadedPath = ref('')
const displayLoadedAuths = computed(() => loadedAuths.value?.filter((auth) => auth.Resource.includes(loadedPath.value)))

const getAppAuths = (offset: number, limit: number) => {
  auth.getAppAuths({
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
  }, (error: boolean, rows?: Array<authing.Auth>) => {
    if (error || !rows?.length) {
      return
    }
    getAppAuths(offset + limit, limit)
  })
}
const prepare = () => {
  if (!auths.value.length) {
    getAppAuths(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

interface SavedAuths {
  Application: app.App
  Auths: Array<authing.Auth>
}

const onExportClick = () => {
  const myApp = application.app(AppID.value)
  const blob = new Blob([JSON.stringify({
    Application: myApp,
    Auths: auths.value
  })], { type: 'text/plain;charset=utf-8' })
  const filename = (myApp?.Name as string) + '-' +
                   (myApp?.EntID as string) + '-auths-' +
                   utils.formatTime(new Date().getTime() / 1000) +
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
      // application.AppID = loaded.Application.ID
      loadedAuths.value = loaded.Auths
    }
    reader.readAsText(filename)
  }
}

const onSubmitClick = () => {
  loadedAuths.value.forEach((a) => {
    if (a.UserID.length > 0) {
      auth.createAppAuth({
        TargetAppID: a.AppID,
        TargetUserID: a.UserID,
        Resource: a.Resource,
        Method: a.Method,
        Message: {
          Error: {
            Title: 'MSG_CREATE_APP_USER_AUTH',
            Message: 'MSG_CREATE_APP_USER_AUTH_FAIL',
            Popup: true,
            Type: notify.NotifyType.Error
          },
          Info: {
            Title: 'MSG_CREATE_APP_USER_AUTH',
            Message: 'MSG_CREATE_APP_USER_AUTH_FAIL',
            Popup: true,
            Type: notify.NotifyType.Success
          }
        }
      }, () => {
        // TODO
      })
      return
    }

    if (a.RoleID.length > 0) {
      auth.createAppAuth({
        TargetAppID: a.AppID,
        RoleID: a.RoleID,
        Resource: a.Resource,
        Method: a.Method,
        Message: {
          Error: {
            Title: 'MSG_CREATE_APP_ROLE_AUTH',
            Message: 'MSG_CREATE_APP_ROLE_AUTH_FAIL',
            Popup: true,
            Type: notify.NotifyType.Error
          },
          Info: {
            Title: 'MSG_CREATE_APP_ROLE_AUTH',
            Message: 'MSG_CREATE_APP_ROLE_AUTH_FAIL',
            Popup: true,
            Type: notify.NotifyType.Success
          }
        }
      }, () => {
        // TODO
      })
      return
    }

    auth.createAppAuth({
      TargetAppID: a.AppID,
      TargetUserID: a.UserID,
      Resource: a.Resource,
      Method: a.Method,
      Message: {
        Error: {
          Title: 'MSG_CREATE_APP_AUTH',
          Message: 'MSG_CREATE_APP_AUTH_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        },
        Info: {
          Title: 'MSG_CREATE_APP_AUTH',
          Message: 'MSG_CREATE_APP_AUTH_FAIL',
          Popup: true,
          Type: notify.NotifyType.Success
        }
      }
    }, () => {
      // TODO
    })
  })
}

</script>
