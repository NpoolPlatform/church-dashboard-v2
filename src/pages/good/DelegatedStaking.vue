<template>
  <DelegatedStaking />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DelegatedStaking = defineAsyncComponent(() => import('src/components/good/DelegatedStaking.vue'))

</script>

<style lang='sass' scoped>
</style>
