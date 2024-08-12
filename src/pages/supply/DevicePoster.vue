<template>
  <DevicePoster />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DevicePoster = defineAsyncComponent(() => import('src/components/supply/DevicePoster.vue'))

</script>

<style lang='sass' scoped>
</style>
