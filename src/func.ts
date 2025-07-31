import type { Coordinates } from '@/Fly.ts'

export async function get_text_pixels(
  text: string,
  fontSize: number,
  font: string = 'Arial',
  bold = false,
) {
  const canvas_input = document.createElement('canvas')
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
    height: metrics,
  }
}

export function output_to_canvas(
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

export function getTime() {
  const date = new Date()
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

export function get_update_coords(
  coords: Coordinates[],
  shift: Coordinates,
  index: number,
  size: number,
) {
  if (index < coords.length - 1) {
    const x = coords[index].x * size + shift.x
    const y = coords[index].y * size + shift.y
    return { x, y }
  } else {
    return null
  }
}

export function getShuffledRange(min: number, max: number) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  // Алгоритм Фишера-Йетса для перемешивания
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }

  return numbers
}

export function calculateAngleFromVertical(start: Coordinates, end: Coordinates) {
  const dx = end.x - start.x
  const dy = end.y - start.y

  const angleRad = Math.atan2(dx, dy)

  let angleDeg = angleRad * (180 / Math.PI)

  if (angleDeg < 0) {
    angleDeg += 360
  }

  return angleDeg
}
