<template>
  <CoinFiat />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinFiat = defineAsyncComponent(() => import('src/components/coin/CoinFiat.vue'))

</script>

<style lang='sass' scoped>
</style>
