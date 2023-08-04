<template>
  <AppThirdParty />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppThirdParty = defineAsyncComponent(() => import('src/components/oauth/AppThirdParty.vue'))

</script>

<style lang='sass' scoped>
</style>
