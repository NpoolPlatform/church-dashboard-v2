<template>
  <Purchase />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Purchase = defineAsyncComponent(() => import('src/components/billing/Purchase.vue'))

</script>

<style lang='sass' scoped>
</style>
