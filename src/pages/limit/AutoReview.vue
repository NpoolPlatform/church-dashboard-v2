<template>
  <AutoReview />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AutoReview = defineAsyncComponent(() => import('src/components/limit/AutoReview.vue'))

</script>

<style lang='sass' scoped>
</style>
