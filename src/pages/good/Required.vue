<template>
  <Required />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Required = defineAsyncComponent(() => import('src/components/good/Required.vue'))

</script>

<style lang='sass' scoped>
</style>
