<template>
  <FiatCurrencyType />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const FiatCurrencyType = defineAsyncComponent(() => import('src/components/coin/FiatCurrencyType.vue'))

</script>

<style lang='sass' scoped>
</style>
