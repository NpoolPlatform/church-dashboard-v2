<template>
  <TopMostGoodConstraint />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMostGoodConstraint = defineAsyncComponent(() => import('src/components/good/TopMostGoodConstraint.vue'))

</script>

<style lang='sass' scoped>
</style>
