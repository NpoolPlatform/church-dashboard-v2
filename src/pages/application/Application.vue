<template>
  <App />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const App = defineAsyncComponent(() => import('src/components/application/App.vue'))

</script>

<style lang='sass' scoped>
</style>
