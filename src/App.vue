<template>
  <div class="wrapper" ref="div_wrapper" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {Clock2} from '@/examples/Clock.ts'

const div_wrapper = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!div_wrapper.value) return

  const clock = new Clock2(div_wrapper.value)
  clock.start()
})
</script>

<style>
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
