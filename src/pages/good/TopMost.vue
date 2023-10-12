<template>
  <TopMost />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMost = defineAsyncComponent(() => import('src/components/good/TopMost.vue'))

</script>

<style lang='sass' scoped>
</style>
