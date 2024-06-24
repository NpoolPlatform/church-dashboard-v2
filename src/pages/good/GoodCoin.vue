<template>
  <GoodCoin />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const GoodCoin = defineAsyncComponent(() => import('src/components/good/GoodCoin.vue'))

</script>

<style lang='sass' scoped>
</style>
