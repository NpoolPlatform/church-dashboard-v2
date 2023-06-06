<template>
  <CoinFeed />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinFeed = defineAsyncComponent(() => import('src/components/coin/CoinFeed.vue'))

</script>

<style lang='sass' scoped>
</style>
