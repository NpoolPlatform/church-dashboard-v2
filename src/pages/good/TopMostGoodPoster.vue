<template>
  <TopMostGoodPoster />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TopMostGoodPoster = defineAsyncComponent(() => import('src/components/good/TopMostGoodPoster.vue'))

</script>

<style lang='sass' scoped>
</style>
