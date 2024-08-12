<template>
  <Poster />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Poster = defineAsyncComponent(() => import('src/components/good/Poster.vue'))

</script>

<style lang='sass' scoped>
</style>
