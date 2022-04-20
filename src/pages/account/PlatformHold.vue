<template>
  <PlatformHold />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const PlatformHold = defineAsyncComponent(() => import('src/components/account/PlatformHold.vue'))

</script>

<style lang='sass' scoped>
</style>
