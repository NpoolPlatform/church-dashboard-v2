<template>
  <OfflinePowerRental />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OfflinePowerRental = defineAsyncComponent(() => import('src/components/order/OfflinePowerRental.vue'))

</script>

<style lang='sass' scoped>
</style>
