<template>
  <OracleCurrency />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OracleCurrency = defineAsyncComponent(() => import('src/components/coin/OracleCurrency.vue'))

</script>

<style lang='sass' scoped>
</style>
