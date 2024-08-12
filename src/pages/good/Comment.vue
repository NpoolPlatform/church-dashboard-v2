<template>
  <Comment />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Comment = defineAsyncComponent(() => import('src/components/good/Comment.vue'))

</script>

<style lang='sass' scoped>
</style>
