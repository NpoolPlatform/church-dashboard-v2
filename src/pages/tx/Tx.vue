<template>
  <Tx />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Tx = defineAsyncComponent(() => import('src/components/tx/Tx.vue'))

</script>

<style lang='sass' scoped>
</style>
