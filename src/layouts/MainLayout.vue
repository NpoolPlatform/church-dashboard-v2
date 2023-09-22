<template>
  <q-layout view='hHh Lpr fFf'>
    <MainHeader />
    <MainDrawer />

    <q-page-container>
      <Announcement />
      <MainBreadcrumbs />
      <router-view />
    </q-page-container>

    <Footer />

    <LangLoader />
  </q-layout>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, watch, computed } from 'vue'
import { notify, requesterror, user } from 'src/npoolstore'
import { useRouter } from 'vue-router'
import 'src/api/app'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const Announcement = defineAsyncComponent(() => import('src/components/announcement/Announcement.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const MainBreadcrumbs = defineAsyncComponent(() => import('src/components/breadcrumbs/MainBreadcrumbs.vue'))
const MainDrawer = defineAsyncComponent(() => import('src/components/drawer/MainDrawer.vue'))

const errorswitcher = requesterror.useErrorStore()
const trigger = computed(() => errorswitcher.ErrorTrigger)
const logined = user.useLocalUserStore()
const router = useRouter()
const notification = notify.useNotificationStore()

watch(trigger, () => {
  if (!trigger.value) {
    return
  }
  switch (trigger.value.Target) {
    case requesterror.SwitchTarget.LOGIN:
      void router.push('/signin')
      errorswitcher.ErrorTrigger = undefined as unknown as requesterror.ErrorTarget
      logined.restUser()
  }
})

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        notify.notify(notif)
      }
    })
  })
})
</script>

<style lang='sass' scoped>
.q-page-container
  ::v-deep .q-table__container
    padding-bottom: 60px
</style>
