<template>
  <DisplayColor />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DisplayColor = defineAsyncComponent(() => import('src/components/good/DisplayColor.vue'))

</script>

<style lang='sass' scoped>
</style>
