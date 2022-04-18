<template>
  <Role />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Role = defineAsyncComponent(() => import('src/components/auth/Role.vue'))

</script>

<style lang='sass' scoped>
</style>
