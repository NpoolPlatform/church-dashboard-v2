<template>
  <AppFee />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppFee = defineAsyncComponent(() => import('src/components/good/AppFee.vue'))

</script>

<style lang='sass' scoped>
</style>
