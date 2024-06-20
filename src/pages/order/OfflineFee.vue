<template>
  <OfflineFee />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OfflineFee = defineAsyncComponent(() => import('src/components/order/OfflineFee.vue'))

</script>

<style lang='sass' scoped>
</style>
