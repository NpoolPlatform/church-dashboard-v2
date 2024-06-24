<template>
  <AppDefaultGood />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))

</script>

<style lang='sass' scoped>
</style>
