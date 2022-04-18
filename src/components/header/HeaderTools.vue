<template>
  <div class='row'>
    <q-btn-dropdown
      delse
      flat
      :options='applications'
      :label='selectedApp ? selectedApp.App.Name : $t("MSG_SELECT_APPLICATION")'
      class='select'
      auto-close
      no-caps
      v-if='logined'
    >
      <q-list>
        <q-item
          v-for='app in applications'
          :key='app.App.ID'
          clickable
          @click='onAppSelected(app)'
        >
          {{ app.App.Name }}
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <HeaderToolBtn :icon='bellIcon' />
    <LangSwitcher />
    <AvatarDropdown v-if='logined' />
  </div>
</template>

<script setup lang='ts'>
import { useApplicationsStore, useLoginedUserStore, useMailboxStore, Application, NotificationType } from 'npool-cli-v2'
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useLocalApplicationStore } from 'src/localstore'

import bellNoMsg from '../../assets/bell-no-msg.svg'
import bellMsg from '../../assets/bell-msg.svg'

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const HeaderToolBtn = defineAsyncComponent(() => import('src/components/header/HeaderToolBtn.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const loginedUser = useLoginedUserStore()
const logined = computed(() => loginedUser.getLogined)

const application = useApplicationsStore()
const localapplication = useLocalApplicationStore()

const applications = computed(() => application.Applications)
const selectedApp = computed({
  get: () => application.getApplicationByID(localapplication.AppID),
  set: (val: Application) => {
    localapplication.AppID = val.App.ID
  }
})

const mailbox = useMailboxStore()
const bellIcon = computed(() => mailbox.Notifications.length > 0 ? bellMsg : bellNoMsg)

onMounted(() => {
  application.getApplications({
    Message: {
      Error: {
        Title: 'MSG_GET_APPLICATIONS',
        Message: 'MSG_GET_APPLICATIONS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const onAppSelected = (app: Application) => {
  selectedApp.value = app
}

</script>

<style lang='sass' scoped>
.select
  border-bottom: solid 1px $primary
</style>
