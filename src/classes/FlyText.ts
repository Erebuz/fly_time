import {Fly, type Point} from "@/classes/Fly.ts";

export class FlyText {
  parent: HTMLElement
  render_loop: number | null = null
  max: Point = { x: 0, y: 0 }
  flies: Fly[] = []

  baseFontSize = 14
  fontSizeMultiplier = 6
  renderInterval = 20

  constructor(parent: HTMLElement, fliesCount = 1000) {
    this.parent = parent

    this.max.x = parent.clientWidth
    this.max.y = parent.clientHeight

    for (let i = 0; i < fliesCount; i++) {
      this.flies.push(new Fly(this.parent, this.max))
    }

    this.flies.forEach((fly) => {
      fly.moveTo()
    })

    this.render_loop = setInterval(() => {
      this.flies.forEach((fly) => {
        fly.render_move()
      })
    }, this.renderInterval)
  }

  stop() {
    if (this.render_loop) {
      clearInterval(this.render_loop)
    }
  }

  get_text_pixels(text: string, fontSize: number, font: string = 'Arial', bold = false) {
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
      height: this.baseFontSize * this.fontSizeMultiplier,
    }
  }
}
