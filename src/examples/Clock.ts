import { type Point, Fly } from '@/classes/Fly.ts'
import {Clock} from "@/classes/Clock.ts";

export class ClockRandom extends Clock {
  getFliesToUse(flies: Fly[], count: number, text: Point): Fly[] {
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

export class ClockNearest extends Clock {
  getFliesToUse(flies: Fly[], count: number, text: Point): Fly[] {
    const flies_with_distance = flies.map((fly) => ({
      fly,
      distance: Math.hypot(fly.x - text.x, fly.y - text.y),
    }))

    return flies_with_distance
      .toSorted((a, b) => a.distance - b.distance)
      .slice(0, count)
      .map((fly_with_distance) => fly_with_distance.fly)
  }
}
