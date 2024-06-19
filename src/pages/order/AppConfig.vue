<template>
  <AppConfig />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppConfig = defineAsyncComponent(() => import('src/components/order/AppConfig.vue'))

</script>

<style lang='sass' scoped>
</style>
