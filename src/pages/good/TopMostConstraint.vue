<template>
  <TopMostConstraint />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMostConstraint = defineAsyncComponent(() => import('src/components/good/TopMostConstraint.vue'))

</script>

<style lang='sass' scoped>
</style>
