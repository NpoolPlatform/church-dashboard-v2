<template>
  <App />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const App = defineAsyncComponent(() => import('src/components/auth/App.vue'))

</script>

<style lang='sass' scoped>
</style>
