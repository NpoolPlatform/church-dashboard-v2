<template>
  <div class='row'>
    <q-btn-dropdown
      delse
      flat
      :options='applications'
      :label='selectedApp ? selectedApp.Name : $t("MSG_SELECT_APPLICATION")'
      auto-close
      no-caps
      v-if='logined'
    >
      <q-list>
        <q-item
          dense
          v-for='app in applications'
          :key='app.ID'
          clickable
          @click='onAppSelected(app)'
        >
          {{ app.Name }}
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
import { useMailboxStore } from 'npool-cli-v2'
import { defineAsyncComponent, computed, watch, onMounted } from 'vue'
import { useLocalApplicationStore } from 'src/localstore'
import { App, useChurchAppStore, useLocalUserStore, NotifyType } from 'npool-cli-v4'

import bellNoMsg from '../../assets/bell-no-msg.svg'
import bellMsg from '../../assets/bell-msg.svg'

const tracing = 'https://www.jaegertracing.io/img/jaeger-icon-reverse-color.svg'
const github = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png'

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const HeaderToolBtn = defineAsyncComponent(() => import('src/components/header/HeaderToolBtn.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const loginedUser = useLocalUserStore()
const logined = computed(() => loginedUser.logined)

const application = useChurchAppStore()
const localapplication = useLocalApplicationStore()

const applications = computed(() => application.Apps.Apps)
const selectedApp = computed({
  get: () => applications.value.find((el) => el.ID === localapplication.AppID) as App,
  set: (val: App) => {
    localapplication.AppID = val.ID
  }
})

const mailbox = useMailboxStore()
const bellIcon = computed(() => mailbox.Notifications.length > 0 ? bellMsg : bellNoMsg)

const onAppSelected = (app: App) => {
  selectedApp.value = app
}

watch(logined, () => {
  if (!logined.value) {
    return
  }
  if (application.Apps.Apps.length === 0) {
    getApps(0, 500)
  }
})

onMounted(() => {
  if (!logined.value) {
    return
  }
  if (application.Apps.Apps.length === 0) {
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
        Type: NotifyType.Error
      }
    }
  }, (apps: Array<App>, error: boolean) => {
    if (error || apps.length < limit) {
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
