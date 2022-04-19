<template>
  <FeeType />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const FeeType = defineAsyncComponent(() => import('src/components/fee/FeeType.vue'))

</script>

<style lang='sass' scoped>
</style>
