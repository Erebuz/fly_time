<template>
  <div class="wrapper" ref="div_wrapper" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Fly } from '@/Fly.ts'
import { get_text_pixels, get_update_coords, getShuffledRange, getTime } from '@/func.ts'

const div_wrapper = ref<HTMLDivElement | null>(null)

const flies: Fly[] = []

const max = {
  x: document.documentElement.clientWidth - 20,
  y: document.documentElement.clientHeight - 20,
}

const baseFontSize = 14
const fontSizeMultiplier = 6
const renderInterval = 20

onMounted(() => {
  if (!div_wrapper.value) return

  for (let i = 0; i < 1000; i++) {
    flies.push(new Fly(div_wrapper.value, max))
  }

  flies.forEach((fly) => {
    fly.move()
  })

  setInterval(() => {
    flies.forEach((fly) => {
      fly.render()
    })
  }, renderInterval)

  setInterval(async () => {
    const textPixels = await get_text_pixels(getTime(), baseFontSize, 'Verdana', false)

    const text_x = Math.random() * (max.x - textPixels.width * fontSizeMultiplier)
    const text_y = Math.random() * (max.y - baseFontSize * fontSizeMultiplier)

    const indexes = getShuffledRange(0, flies.length - 1)

    indexes.forEach((item, index) => {
      const fly = flies[item]

      if (index <= textPixels.coords.length - 1) {
        const coordinate = get_update_coords(
          textPixels.coords,
          { x: text_x, y: text_y },
          index,
          fontSizeMultiplier,
        )
        const pathTime = (Math.random() + 1) * 200 + 400
        const awaitTime = (Math.random() + 1) * 800 + 200
        fly.move(coordinate, pathTime / renderInterval, awaitTime, 0.7)
      }
    })
  }, 1000)
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
}
</style>
