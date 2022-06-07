<template>
  <GasFeeder />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const GasFeeder = defineAsyncComponent(() => import('src/components/account/GasFeeder.vue'))

</script>

<style lang='sass' scoped>
</style>
