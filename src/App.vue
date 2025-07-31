<template>
  <div class="wrapper" ref="div_wrapper">
    <div @click="stop">STOP</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {ClockRandom} from '@/examples/Clock.ts'

const div_wrapper = ref<HTMLDivElement | null>(null)
let clock: ClockRandom | null = null

onMounted(() => {
  if (!div_wrapper.value) return

  clock = new ClockRandom(div_wrapper.value, 1000)
  clock.start()
})

function stop() {
 if (!clock) return

 clock.stop()
}
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
