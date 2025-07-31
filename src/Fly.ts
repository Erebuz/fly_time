export interface Coordinates {
  x: number
  y: number
}

export class BaseObject {
  y: number = 0
  x: number = 0
  max: Coordinates = { x: 0, y: 0 }

  private parent: HTMLDivElement | null = null
  private element: HTMLDivElement = document.createElement('div')

  constructor(parent: HTMLDivElement, maxCoord: Coordinates) {
    this.parent = parent
    this.element.style.position = 'absolute'
    this.element.style.height = '10px'
    this.element.style.width = '10px'
    this.element.style.backgroundColor = 'black'
    this.parent.appendChild(this.element)
    this.max = maxCoord

    this.update()
  }

  update() {
    this.element.style.top = `${this.y}px`
    this.element.style.left = `${this.x}px`

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

  move(
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
    this.pathCyclesCount = pathCycles ? Math.round(pathCycles) : (Math.random() + 1) * 50
    this.awaitTime = awaitTimeMs ? Math.round(awaitTimeMs) : (Math.random() + 1) * 500
    this.speed_x = (this.target.x - this.start.x) / this.pathCyclesCount + (1 - accuracy)
    this.speed_y = (this.target.y - this.start.y) / this.pathCyclesCount + (1 - accuracy)
    this.reserved = true
  }

  render() {
    if (this.pathCyclesCount > 0 && this.reserved) {
      this.x += this.speed_x
      this.y += this.speed_y
      this.pathCyclesCount -= 1
    } else {
      if (!this.awaitTimeout) {
        this.awaitTimeout = setTimeout(() => {
          this.reserved = false
          this.awaitTimeout = null
          this.move()
        }, this.awaitTime)
      }
    }
  }
}
