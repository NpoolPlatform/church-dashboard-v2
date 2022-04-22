<template>
  <PurchaseAmount />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const PurchaseAmount = defineAsyncComponent(() => import('src/components/inspire/PurchaseAmount.vue'))

</script>

<style lang='sass' scoped>
</style>
