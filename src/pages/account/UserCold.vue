<template>
  <UserCold />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserCold = defineAsyncComponent(() => import('src/components/account/UserCold.vue'))

</script>

<style lang='sass' scoped>
</style>
