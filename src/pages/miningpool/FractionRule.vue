<template>
  <UserHot />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserHot = defineAsyncComponent(() => import('src/components/miningpool/FractionRule.vue'))

</script>

<style lang='sass' scoped>
</style>
