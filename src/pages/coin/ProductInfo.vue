<template>
  <ProductInfo />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const ProductInfo = defineAsyncComponent(() => import('src/components/coin/ProductInfo.vue'))

</script>

<style lang='sass' scoped>
</style>
