<template>
  <Benefit />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Benefit = defineAsyncComponent(() => import('src/components/billing/Benefit.vue'))

</script>

<style lang='sass' scoped>
</style>
