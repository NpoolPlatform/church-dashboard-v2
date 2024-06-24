<template>
  <RequiredAppGood />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RequiredAppGood = defineAsyncComponent(() => import('src/components/good/RequiredAppGood.vue'))

</script>

<style lang='sass' scoped>
</style>
