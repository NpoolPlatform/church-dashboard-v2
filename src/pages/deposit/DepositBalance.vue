<template>
  <DepositBalance />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DepositBalance = defineAsyncComponent(() => import('src/components/deposit/DepositBalance.vue'))

</script>

<style lang='sass' scoped>
</style>
