<template>
  <EventCoupon />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const EventCoupon = defineAsyncComponent(() => import('src/components/inspire/EventCoupon.vue'))

</script>

<style lang='sass' scoped>
</style>
