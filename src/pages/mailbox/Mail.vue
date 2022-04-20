<template>
  <Mail />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Mail = defineAsyncComponent(() => import('src/components/mailbox/Mail.vue'))

</script>

<style lang='sass' scoped>
</style>
