<template>
  <CoinCurrencyHistory />
  <FiatCurrencyHistory />
  <CoinFiatCurrencyHistory />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/CoinCurrencyHistory.vue'))
const FiatCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/FiatCurrencyHistory.vue'))
const CoinFiatCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/CoinFiatCurrencyHistory.vue'))
</script>
