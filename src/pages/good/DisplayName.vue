<template>
  <DisplayName />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DisplayName = defineAsyncComponent(() => import('src/components/good/DisplayName.vue'))

</script>

<style lang='sass' scoped>
</style>
