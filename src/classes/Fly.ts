export interface Point {
  x: number
  y: number
}

export class BaseObject {
  size = 10
  y = 0
  x = 0
  max: Point = { x: 0, y: 0 }
  rotate = 0

  private parent: HTMLElement
  public element: HTMLElement

  constructor(parent: HTMLElement, max: Point) {
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
  start: Point = { x: 0, y: 0 }
  target: Point = { x: 0, y: 0 }
  pathCyclesCount: number = 0
  awaitTime: number = 0
  reserved: boolean = false
  speed_x: number = 0
  speed_y: number = 0

  moveTo(
    target: Point | null = null,
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

  calculateAngleFromVertical(start: Point, end: Point) {
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
