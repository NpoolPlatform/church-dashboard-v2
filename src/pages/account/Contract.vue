<template>
  <Contract />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Contract = defineAsyncComponent(() => import('src/components/account/Contract.vue'))

</script>

<style lang='sass' scoped>
</style>
