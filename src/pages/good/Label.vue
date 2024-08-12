<template>
  <Label />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Label = defineAsyncComponent(() => import('src/components/good/Label.vue'))

</script>

<style lang='sass' scoped>
</style>
