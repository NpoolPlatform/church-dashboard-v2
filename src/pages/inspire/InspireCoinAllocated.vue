<template>
  <CoinAllocated />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinAllocated = defineAsyncComponent(() => import('src/components/inspire/CoinAllocated.vue'))

</script>

<style lang='sass' scoped>
</style>
