<template>
  <UserTask />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UserTask = defineAsyncComponent(() => import('src/components/inspire/UserTask.vue'))

</script>

<style lang='sass' scoped>
</style>
