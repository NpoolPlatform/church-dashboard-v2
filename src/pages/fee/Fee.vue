<template>
  <Fee />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Fee = defineAsyncComponent(() => import('src/components/fee/Fee.vue'))

</script>

<style lang='sass' scoped>
</style>
