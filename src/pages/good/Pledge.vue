<template>
  <Pledge />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Pledge = defineAsyncComponent(() => import('src/components/good/Pledge.vue'))

</script>

<style lang='sass' scoped>
</style>
