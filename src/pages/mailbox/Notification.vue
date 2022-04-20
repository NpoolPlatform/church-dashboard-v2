<template>
  <Notification />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Notification = defineAsyncComponent(() => import('src/components/mailbox/Notification.vue'))

</script>

<style lang='sass' scoped>
</style>
