<template>
  <ThirdParty />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const ThirdParty = defineAsyncComponent(() => import('src/components/oauth/ThirdParty.vue'))

</script>

<style lang='sass' scoped>
</style>
