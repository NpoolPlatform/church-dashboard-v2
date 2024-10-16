<template>
  <CoinConfig />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinConfig = defineAsyncComponent(() => import('src/components/inspire/CoinConfig.vue'))

</script>

<style lang='sass' scoped>
</style>
