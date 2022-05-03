<template>
  <EmailSubscriber />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const EmailSubscriber = defineAsyncComponent(() => import('src/components/subscriber/EmailSubscriber.vue'))

</script>

<style lang='sass' scoped>
</style>
