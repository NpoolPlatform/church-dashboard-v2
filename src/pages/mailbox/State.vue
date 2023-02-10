<template>
  <State />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const State = defineAsyncComponent(() => import('src/components/mailbox/State.vue'))

</script>

<style lang='sass' scoped>
</style>
