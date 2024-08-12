<template>
  <AppPowerRental />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppPowerRental = defineAsyncComponent(() => import('src/components/good/AppPowerRental.vue'))

</script>

<style lang='sass' scoped>
</style>
