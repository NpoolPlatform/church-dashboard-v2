<template>
  <UserHold />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserHold = defineAsyncComponent(() => import('src/components/account/UserHold.vue'))

</script>

<style lang='sass' scoped>
</style>
