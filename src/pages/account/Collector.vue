<template>
  <Collector />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Collector = defineAsyncComponent(() => import('src/components/account/Collector.vue'))

</script>

<style lang='sass' scoped>
</style>
