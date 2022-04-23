<template>
  <UserCoupon />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserCoupon = defineAsyncComponent(() => import('src/components/inspire/UserCoupon.vue'))

</script>

<style lang='sass' scoped>
</style>
