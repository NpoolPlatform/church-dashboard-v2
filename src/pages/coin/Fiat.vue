<template>
  <Fiat />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Fiat = defineAsyncComponent(() => import('src/components/coin/Fiat.vue'))

</script>

<style lang='sass' scoped>
</style>
