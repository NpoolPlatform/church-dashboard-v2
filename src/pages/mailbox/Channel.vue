<template>
  <Channel />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Channel = defineAsyncComponent(() => import('src/components/mailbox/Channel.vue'))

</script>

<style lang='sass' scoped>
</style>
