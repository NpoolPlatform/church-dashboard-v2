<template>
  <VendorLocation />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const VendorLocation = defineAsyncComponent(() => import('src/components/supply/VendorLocation.vue'))

</script>

<style lang='sass' scoped>
</style>
