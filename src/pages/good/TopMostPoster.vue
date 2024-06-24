<template>
  <TopMostPoster />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMostPoster = defineAsyncComponent(() => import('src/components/good/TopMostPoster.vue'))

</script>

<style lang='sass' scoped>
</style>
