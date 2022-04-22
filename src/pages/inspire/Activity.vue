<template>
  <Activity />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Activity = defineAsyncComponent(() => import('src/components/inspire/Activity.vue'))

</script>

<style lang='sass' scoped>
</style>
