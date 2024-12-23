<template>
  <AppPledge />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppPledge = defineAsyncComponent(() => import('src/components/good/AppPledge.vue'))

</script>

<style lang='sass' scoped>
</style>
