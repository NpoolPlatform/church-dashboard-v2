<template>
  <DirectBenefit />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const DirectBenefit = defineAsyncComponent(() => import('src/components/account/DirectBenefit.vue'))

</script>

<style lang='sass' scoped>
</style>
