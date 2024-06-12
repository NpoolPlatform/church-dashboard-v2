<template>
  <TaskConfig />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const TaskConfig = defineAsyncComponent(() => import('src/components/inspire/TaskConfig.vue'))

</script>

<style lang='sass' scoped>
</style>
