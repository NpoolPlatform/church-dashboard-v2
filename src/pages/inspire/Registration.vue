<template>
  <Registration />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Registration = defineAsyncComponent(() => import('src/components/inspire/Registration.vue'))

</script>

<style lang='sass' scoped>
</style>
