<template>
  <AppGood />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppGood = defineAsyncComponent(() => import('src/components/good/AppGood.vue'))

</script>

<style lang='sass' scoped>
</style>
