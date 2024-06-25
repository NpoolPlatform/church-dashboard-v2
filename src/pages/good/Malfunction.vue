<template>
  <Malfunction />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Malfunction = defineAsyncComponent(() => import('src/components/good/Malfunction.vue'))

</script>

<style lang='sass' scoped>
</style>
