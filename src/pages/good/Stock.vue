<template>
  <Stock />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Stock = defineAsyncComponent(() => import('src/components/good/Stock.vue'))

</script>

<style lang='sass' scoped>
</style>
