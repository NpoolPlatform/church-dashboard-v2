<template>
  <UserReward />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserReward = defineAsyncComponent(() => import('src/components/inspire/UserReward.vue'))

</script>

<style lang='sass' scoped>
</style>
