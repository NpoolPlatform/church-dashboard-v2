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
import {
  useNotificationStore as useOldNotificationStore,
  notify as OldNotify,
  useErrorSwitcherStore as useOldErrorSwitcherStore,
  SwitchTarget as OldSwitchTarget,
  ErrorTarget as OldErrorTarget,
  NotificationType,
  useCoinStore
} from 'npool-cli-v2'

import { ErrorTarget, notify, NotifyType, SwitchTarget, useErrorStore, useLocalUserStore, useNotificationStore, User } from 'npool-cli-v4'
import { useRouter } from 'vue-router'
import { useChurchGoodStore } from 'src/teststore/good/good'
import { useI18n } from 'vue-i18n'
import { Good } from 'src/teststore/good/good/types'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const Announcement = defineAsyncComponent(() => import('src/components/announcement/Announcement.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const MainBreadcrumbs = defineAsyncComponent(() => import('src/components/breadcrumbs/MainBreadcrumbs.vue'))
const MainDrawer = defineAsyncComponent(() => import('src/components/drawer/MainDrawer.vue'))

const errorswitcher = useOldErrorSwitcherStore()
const trigger = computed(() => errorswitcher.ErrorTrigger)

const logined = useLocalUserStore()

const router = useRouter()
const notification = useOldNotificationStore()
const notificationV4 = useNotificationStore()
watch(trigger, () => {
  if (!trigger.value) {
    return
  }
  switch (trigger.value.Target) {
    case OldSwitchTarget.LOGIN:
      void router.push('/signin')
      errorswitcher.ErrorTrigger = undefined as unknown as OldErrorTarget
      logined.User = undefined as unknown as User
  }
})

const errorswitcherV4 = useErrorStore()
const triggerV4 = computed(() => errorswitcherV4.ErrorTrigger)

watch(triggerV4, () => {
  if (!triggerV4.value) {
    return
  }
  switch (triggerV4.value.Target) {
    case SwitchTarget.LOGIN:
      void router.push('/signin')
      errorswitcherV4.ErrorTrigger = undefined as unknown as ErrorTarget
      logined.User = undefined as unknown as User
  }
})

const good = useChurchGoodStore()
const coin = useCoinStore()

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        OldNotify(notif)
      }
    })
  })
  notificationV4.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        notify(notif)
      }
    })
  })
  if (good.Goods.Goods.length === 0) {
    getGoods(0, 500)
  }
  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: 'MSG_GET_COINS',
          Message: 'MSG_GET_COINS_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

const getGoods = (offset: number, limit: number) => {
  good.getGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Good>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getGoods(offset + limit, limit)
  })
}
</script>

<style lang='sass' scoped>
</style>
