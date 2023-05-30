<template>
  <History />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const History = defineAsyncComponent(() => import('src/components/coin/History.vue'))

</script>

<style lang='sass' scoped>
</style>
