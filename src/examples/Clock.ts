import { type Coordinates, Fly, FlyText } from '@/classes/Fly.ts'

export class Clock extends FlyText {
  /**
   * Время перемещения объекта.<br>[0] - постоянное время,<br>[1] - случайная часть
   * @default [600, 200]
   */
  pathTime = [600, 200]

  /**
   * Время ожидания объекта после окончания перемещения.<br>[0] - постоянное время,<br>[1] - случайная часть
   * @default [1000, 800]
   */
  awaitTime = [1000, 800]

  start() {
    setInterval(async () => {
      const textPixels = this.get_text_pixels(this.getTime(), this.baseFontSize, 'Verdana', false)

      const text_x = Math.random() * (this.max.x - textPixels.width * this.fontSizeMultiplier)
      const text_y = Math.random() * (this.max.y - this.baseFontSize * this.fontSizeMultiplier)

      const flies = this.getFliesToUse(this.flies, textPixels.coords.length)

      flies.forEach((fly, index) => {
        const coordinate = this.getUpdateCoordinates(
          textPixels.coords,
          { x: text_x, y: text_y },
          index,
          this.fontSizeMultiplier,
        )
        const pathTime = this.pathTime[0] + Math.random() * this.pathTime[1]
        const awaitTime = this.awaitTime[0] + Math.random() * this.awaitTime[1]
        fly.moveTo(coordinate, pathTime / this.renderInterval, awaitTime, 0.7)
      })
    }, 1000)
  }

  getTime() {
    const date = new Date()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  }

  getUpdateCoordinates(coords: Coordinates[], shift: Coordinates, index: number, size: number) {
    if (index < coords.length - 1) {
      const x = coords[index].x * size + shift.x
      const y = coords[index].y * size + shift.y
      return { x, y }
    } else {
      return null
    }
  }

  getFliesToUse(flies: Fly[], count: number) {
    const min = 0
    const max = flies.length - 1
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i)

    // Алгоритм Фишера-Йетса для перемешивания
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    return numbers.splice(0, count).map((i) => flies[i])
  }
}

export class Clock2 extends Clock {
  getFliesToUse(flies: Fly[], count: number) {
    return flies.toSpliced(0, count)
  }
}
