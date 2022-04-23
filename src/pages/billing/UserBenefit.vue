<template>
  <UserBenefit />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserBenefit = defineAsyncComponent(() => import('src/components/billing/UserBenefit.vue'))

</script>

<style lang='sass' scoped>
</style>
