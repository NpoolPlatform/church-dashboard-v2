<template>
  <DeviceManufacturer />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DeviceManufacturer = defineAsyncComponent(() => import('src/components/supply/DeviceManufacturer.vue'))

</script>

<style lang='sass' scoped>
</style>
