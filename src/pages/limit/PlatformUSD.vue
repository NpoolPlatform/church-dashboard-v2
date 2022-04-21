<template>
  <PlatformUSD />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const PlatformUSD = defineAsyncComponent(() => import('src/components/limit/PlatformUSD.vue'))

</script>

<style lang='sass' scoped>
</style>
