<template>
  <AppSubscribe />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppSubscribe = defineAsyncComponent(() => import('src/components/subscriber/AppSubscribe.vue'))

</script>

<style lang='sass' scoped>
</style>
