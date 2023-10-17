<template>
  <Frontend />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Frontend = defineAsyncComponent(() => import('src/components/template/Frontend.vue'))

</script>

<style lang='sass' scoped>
</style>
