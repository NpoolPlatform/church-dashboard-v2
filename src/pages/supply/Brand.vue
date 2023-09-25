<template>
  <Brand />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Brand = defineAsyncComponent(() => import('src/components/supply/Brand.vue'))

</script>

<style lang='sass' scoped>
</style>
