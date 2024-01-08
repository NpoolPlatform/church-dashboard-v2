<template>
  <CouponWithdraw />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CouponWithdraw = defineAsyncComponent(() => import('src/components/review/CouponWithdraw.vue'))

</script>

<style lang='sass' scoped>
</style>
