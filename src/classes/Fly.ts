export interface Coordinates {
  x: number
  y: number
}

export class BaseObject {
  size = 10
  y = 0
  x = 0
  max: Coordinates = { x: 0, y: 0 }
  rotate = 0

  private parent: HTMLElement
  public element: HTMLElement

  constructor(parent: HTMLElement, max: Coordinates) {
    this.parent = parent
    this.max = { x: max.x - this.size * 2, y: max.y - this.size * 2 }

    this.element = document.createElement('div')
    this.createElement()
    this.element.style.position = 'absolute'
    this.parent.appendChild(this.element)

    this.update()
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.style.position = 'absolute'
    this.element.style.height = `${this.size}px`
    this.element.style.width = `${this.size}px`
    this.element.style.backgroundColor = 'black'
  }

  update() {
    this.element.style.top = `${this.y}px`
    this.element.style.left = `${this.x}px`
    this.element.style.rotate = `${this.rotate}deg`

    requestAnimationFrame(this.update.bind(this))
  }
}

export class AnimationObject extends BaseObject {
  awaitTimeout: number | null = null
  start: Coordinates = { x: 0, y: 0 }
  target: Coordinates = { x: 0, y: 0 }
  pathCyclesCount: number = 0
  awaitTime: number = 0
  reserved: boolean = false
  speed_x: number = 0
  speed_y: number = 0

  moveTo(
    target: Coordinates | null = null,
    pathCycles: number | null = null,
    awaitTimeMs: number | null = null,
    accuracy: number = 1,
  ) {
    if (this.awaitTimeout) {
      clearTimeout(this.awaitTimeout)
      this.awaitTimeout = null
    }

    this.start = { x: this.x, y: this.y }
    this.target = target ? target : { x: Math.random() * this.max.x, y: Math.random() * this.max.y }
    this.rotate = 180 - this.calculateAngleFromVertical(this.start, this.target)
    this.pathCyclesCount = pathCycles ? Math.round(pathCycles) : (Math.random() + 1) * 50
    this.awaitTime = awaitTimeMs ? Math.round(awaitTimeMs) : (Math.random() + 1) * 500
    this.speed_x = (this.target.x - this.start.x) / this.pathCyclesCount + 2 * (1 - accuracy)
    this.speed_y = (this.target.y - this.start.y) / this.pathCyclesCount + 2 * (1 - accuracy)
    this.reserved = true
  }

  render_move() {
    if (this.pathCyclesCount > 0 && this.reserved) {
      this.x += this.speed_x
      this.y += this.speed_y
      this.pathCyclesCount -= 1
    } else {
      if (!this.awaitTimeout) {
        this.awaitTimeout = setTimeout(() => {
          this.reserved = false
          this.awaitTimeout = null
          this.moveTo()
        }, this.awaitTime)
      }
    }
  }

  calculateAngleFromVertical(start: Coordinates, end: Coordinates) {
    const dx = end.x - start.x
    const dy = end.y - start.y

    const angleRad = Math.atan2(dx, dy)

    let angleDeg = angleRad * (180 / Math.PI)

    if (angleDeg < 0) {
      angleDeg += 360
    }

    return angleDeg
  }
}

export class Fly extends AnimationObject {
  createElement() {
    this.element = document.createElement('img') as HTMLImageElement
    this.element.setAttribute('src', '/src/assets/fly.png')
    this.element.style.width = '10px'
    this.element.style.height = '10px'
  }
}

export class FlyText {
  parent: HTMLElement
  max: Coordinates = { x: 0, y: 0 }
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

    setInterval(() => {
      this.flies.forEach((fly) => {
        fly.render_move()
      })
    }, this.renderInterval)
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
      height: metrics,
    }
  }
}
