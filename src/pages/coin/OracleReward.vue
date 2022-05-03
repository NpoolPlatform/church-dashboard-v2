<template>
  <OracleReward />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OracleReward = defineAsyncComponent(() => import('src/components/coin/OracleReward.vue'))

</script>

<style lang='sass' scoped>
</style>
