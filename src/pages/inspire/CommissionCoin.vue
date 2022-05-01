<template>
  <CommissionCoin />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CommissionCoin = defineAsyncComponent(() => import('src/components/inspire/CommissionCoin.vue'))

</script>

<style lang='sass' scoped>
</style>
