<template>
  <Platform />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Platform = defineAsyncComponent(() => import('src/components/account/Platform.vue'))

</script>

<style lang='sass' scoped>
</style>
