<template>
  <Transaction />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Transaction = defineAsyncComponent(() => import('src/components/billing/Transaction.vue'))

</script>

<style lang='sass' scoped>
</style>
