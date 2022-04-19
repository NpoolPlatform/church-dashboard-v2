<template>
  <Device />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Device = defineAsyncComponent(() => import('src/components/supply/Device.vue'))

</script>

<style lang='sass' scoped>
</style>
