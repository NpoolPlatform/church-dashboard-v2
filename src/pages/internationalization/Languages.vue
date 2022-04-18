<template>
  <Languages />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Languages = defineAsyncComponent(() => import('src/components/internationalization/Languages.vue'))

</script>

<style lang='sass' scoped>
</style>
