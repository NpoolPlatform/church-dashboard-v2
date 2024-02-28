<template>
  <SimulateConfig />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const SimulateConfig = defineAsyncComponent(() => import('src/components/order/SimulateConfig.vue'))

</script>

<style lang='sass' scoped>
</style>
