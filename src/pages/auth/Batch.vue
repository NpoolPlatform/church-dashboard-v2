<template>
  <Batch />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Batch = defineAsyncComponent(() => import('src/components/auth/Batch.vue'))

</script>

<style lang='sass' scoped>
</style>
