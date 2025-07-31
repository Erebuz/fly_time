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

