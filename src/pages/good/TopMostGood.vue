<template>
  <TopMostGood />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMostGood = defineAsyncComponent(() => import('src/components/good/TopMostGood.vue'))

</script>

<style lang='sass' scoped>
</style>
