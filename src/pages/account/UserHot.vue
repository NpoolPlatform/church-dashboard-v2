<template>
  <UserHot />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserHot = defineAsyncComponent(() => import('src/components/account/UserHot.vue'))

</script>

<style lang='sass' scoped>
</style>
