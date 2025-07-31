import {FlyText} from "@/classes/FlyText.ts";
import {Fly, type Point} from "@/classes/Fly.ts";

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

  text_loop: number | null = null

  start() {
    this.text_loop = setInterval(async () => {
      const textPixels = this.get_text_pixels(this.getTime(), this.baseFontSize, 'Verdana', false)

      const text_x = Math.random() * (this.max.x - textPixels.width * this.fontSizeMultiplier)
      const text_y = Math.random() * (this.max.y - this.baseFontSize * this.fontSizeMultiplier)

      const flies = this.getFliesToUse(this.flies, textPixels.coords.length, {
        x: text_x + textPixels.width / 2,
        y: text_y + textPixels.height / 2,
      })

      flies.forEach((fly, index) => {
        const coordinate = this.getUpdateCoordinates(
          textPixels.coords,
          { x: text_x, y: text_y },
          index,
          this.fontSizeMultiplier,
        )
        if (coordinate) {
          const pathTime = this.pathTime[0] + Math.random() * this.pathTime[1]
          const awaitTime = this.awaitTime[0] + Math.random() * this.awaitTime[1]
          fly.moveTo(coordinate, pathTime / this.renderInterval, awaitTime, 0.7)
        }
      })
    }, 1000)
  }

  getFliesToUse(flies: Fly[], count: number, text: Point): Fly[] {
    throw Error('Not implemented')
  }

  stop() {
    super.stop()

    if (this.text_loop) {
      clearInterval(this.text_loop)
    }
  }

  getTime() {
    const date = new Date()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  }

  getUpdateCoordinates(coords: Point[], shift: Point, index: number, size: number) {
    if (index < coords.length - 1) {
      const x = coords[index].x * size + shift.x
      const y = coords[index].y * size + shift.y
      return { x, y }
    } else {
      return null
    }
  }
}
