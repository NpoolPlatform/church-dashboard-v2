<template>
  <PowerRental />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const PowerRental = defineAsyncComponent(() => import('src/components/good/PowerRental.vue'))

</script>

<style lang='sass' scoped>
</style>
