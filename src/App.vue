<template>
  <div ref="div_wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const div_wrapper = ref<HTMLDivElement | null>(null)

function get_text_pixels(text: string, fontSize: number, font: string = 'Arial', bold = false) {
  const canvas_input = document.createElement('canvas')
  canvas_input.width = text.length * fontSize * 2
  const ctx = canvas_input.getContext('2d') as CanvasRenderingContext2D
  const font_bold = bold ? 'bold ' : ''
  ctx.font = font_bold + `${fontSize}px ${font}`
  ctx.fillStyle = 'black'
  ctx.textBaseline = 'top'
  ctx.fillText(text, 0, 0)
  const metrics = ctx.measureText(text)

  const imageData = ctx.getImageData(0, 0, canvas_input.width, canvas_input.height)
  const pixels = imageData.data
  const pixelCoords: { x: number; y: number }[] = []

  for (let y = 0; y < canvas_input.height; y++) {
    for (let x = 0; x < canvas_input.width; x++) {
      const index = (y * canvas_input.width + x) * 4
      const alpha = pixels[index + 3]
      if (alpha > 0) {
        pixelCoords.push({ x, y })
      }
    }
  }
  canvas_input.remove()

  return {
    coords: pixelCoords,
    width: metrics.width,
  }
}

function output_to_canvas(
  coordinates: { x: number; y: number }[],
  width: number,
  wrapper: HTMLDivElement,
) {
  const canvas_output = document.createElement('canvas')
  canvas_output.width = width

  wrapper.appendChild(canvas_output)
  const outputCtx = canvas_output.getContext('2d') as CanvasRenderingContext2D

  coordinates.forEach(({ x, y }) => {
    outputCtx.fillRect(x, y, 1, 1)
  })
}

onMounted(() => {
  const coords = get_text_pixels('Привет муха', 40, 'Verdana', true)

  if (!div_wrapper.value) return

  output_to_canvas(coords.coords, coords.width, div_wrapper.value)
})
</script>

