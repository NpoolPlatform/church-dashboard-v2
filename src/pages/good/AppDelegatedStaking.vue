<template>
  <AppDelegatedStaking />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppDelegatedStaking = defineAsyncComponent(() => import('src/components/good/AppDelegatedStaking.vue'))

</script>

<style lang='sass' scoped>
</style>
