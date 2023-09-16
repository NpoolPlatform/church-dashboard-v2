<template>
  <q-drawer v-model='leftDrawerOpen' :mini='leftDrawerMini' show-if-above bordered>
    <div class='row'>
      <q-space />
      <q-btn
        flat dense round icon='swap_horiz'
        aria-label='Menu'
        class='drawer-toggle'
        :disable='!logined'
        @click='toggleLeftDrawer'
      />
    </div>
    <q-list separator>
      <DrawerMenu
        v-for='item in MainDrawerMenus'
        :key='item.label'
        :menu='item'
        :disable='!logined'
        @click='onItemClick(item)'
        :mini='leftDrawerMini'
      />
    </q-list>
  </q-drawer>
</template>
<script setup lang='ts'>
import { ref, defineAsyncComponent, computed } from 'vue'
import { MainDrawerMenus } from 'src/menus/menus'
import { MenuItem, useMenuStore, HomePageBreadcrumbs } from 'src/localstore'
import { user } from 'src/npoolstore'

const DrawerMenu = defineAsyncComponent(() => import('src/components/drawer/DrawerMenu.vue'))

const _user = user.useLocalUserStore()
const logined = computed(() => _user.logined)

const menus = useMenuStore()

const leftDrawerOpen = ref(true)
const leftDrawerMini = ref(!logined.value)

const toggleLeftDrawer = (): void => {
  leftDrawerMini.value = !leftDrawerMini.value
}

const onItemClick = (menu: MenuItem) => {
  menus.MainBreadcrumbs = [HomePageBreadcrumbs, menu] as Array<MenuItem>
}

</script>
<style lang='sass' scoped>
.drawer-toggle
  margin-left: auto
  margin-right: auto
</style>
