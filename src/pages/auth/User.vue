<template>
  <User />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const User = defineAsyncComponent(() => import('src/components/auth/User.vue'))

</script>

<style lang='sass' scoped>
</style>
