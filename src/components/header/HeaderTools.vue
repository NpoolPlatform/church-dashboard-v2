<template>
  <div class='row'>
    <q-btn-dropdown
      dense
      flat
      :options='applications'
      :label='selectedApp ? selectedApp.Name : $t("MSG_SELECT_APPLICATION")'
      no-caps
      v-model='visible'
      v-if='logined'
    >
      <q-list>
        <div class='q-mb-sm q-pa-md'>
          <q-input
            v-model='name'
            label='Search'
            dense
          />
        </div>
        <q-item
          dense
          v-for='_app in displayApplications'
          :key='_app.EntID'
          clickable
          @click='onAppSelected(_app)'
        >
          {{ _app.Name }}
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <HeaderToolBtn :icon='bellIcon' />
    <HeaderToolBtn class='tracing' :icon='tracing' @click='onJeagerClick' />
    <HeaderToolBtn :icon='github' @click='onGithubClick' />
    <LangSwitcher />
    <AvatarDropdown v-if='logined' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, watch, onMounted, ref } from 'vue'
import { app, notif, user, localapp, notify, sdk } from 'src/npoolstore'

import bellNoMsg from '../../assets/bell-no-msg.svg'
import bellMsg from '../../assets/bell-msg.svg'

const tracing = 'https://www.jaegertracing.io/img/jaeger-icon-reverse-color.svg'
const github = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png'

const AppID = sdk.AppID
const MyAppID = sdk.MyAppID

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const HeaderToolBtn = defineAsyncComponent(() => import('src/components/header/HeaderToolBtn.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const loginedUser = user.useLocalUserStore()
const logined = computed(() => loginedUser.logined)

const localApplication = localapp.useLocalApplicationStore()
const application = app.useApplicationStore()

const applications = computed(() => application.Apps)

const name = ref('')
const displayApplications = computed(() => {
  const _applications = [] as Array<app.App>
  application.Apps.forEach((el) => {
    if (el.Name?.toLowerCase().includes(name.value?.toLowerCase())) {
      _applications.push(el)
    }
  })
  return _applications
})

const visible = ref(false)

const selectedApp = computed({
  get: () => application.app(AppID.value) as app.App,
  set: (val: app.App) => {
    localApplication.CurrentAppID = val.EntID
  }
})

const mailbox = notif.useNotifStore()
const bellIcon = computed(() => mailbox.notifs(MyAppID.value, loginedUser.loginedUserID) ? bellMsg : bellNoMsg)

const onAppSelected = (app: app.App) => {
  selectedApp.value = app
  visible.value = false
  name.value = ''
}

watch(logined, () => {
  if (!logined.value) {
    return
  }
  if (applications.value.size === 0) {
    getApps(0, 500)
  }
})

onMounted(() => {
  if (!logined.value) {
    return
  }
  if (!applications.value.size) {
    getApps(0, 500)
  }
})

const getApps = (offset: number, limit: number) => {
  application.getApps({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APPS',
        Message: 'MSG_GET_APPS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, apps?: Array<app.App>) => {
    if (error || !apps?.length) {
      return
    }
    getApps(offset + limit, limit)
  })
}

const onJeagerClick = () => {
  window.open('https://www.jaegertracing.io/')
}

const onGithubClick = () => {
  window.open('https://github.com/NpoolPlatform')
}

</script>

<style lang='sass' scoped>
.tracing
  background-color: white
</style>
