export function bezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const midY = (y1 + y2) / 2;
  // Gentle curve — control points at vertical midpoint
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export function getNodeCenter(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number
): { cx: number; cy: number } {
  return {
    cx: (x / 100) * containerWidth,
    cy: (y / 100) * containerHeight,
  };
}
