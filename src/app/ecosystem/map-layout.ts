import type { Tier } from "./data";

// Pure layout for the ecosystem map: tiers stack top to bottom, nodes in a tier
// spread evenly across the width and wrap onto extra rows when space runs out.

export type Point = { x: number; y: number };
export type TierBand = { id: string; label: string; caption: string; top: number; height: number };
export type MapLayout = { width: number; height: number; nodes: Record<string, Point>; tiers: TierBand[] };

export type LayoutMetrics = {
  minColumn: number;   // narrowest horizontal slot a node and its label may occupy
  maxColumn: number;   // widest slot, so small tiers stay grouped instead of spreading edge to edge
  header: number;      // tier title strip above the nodes
  row: number;         // one row of nodes including labels
  gap: number;         // space between tiers
};

export const DESKTOP_METRICS: LayoutMetrics = { minColumn: 116, maxColumn: 200, header: 34, row: 112, gap: 14 };
export const COMPACT_METRICS: LayoutMetrics = { minColumn: 92, maxColumn: 140, header: 30, row: 98, gap: 10 };
export const COMPACT_BREAKPOINT = 640;

export const metricsFor = (width: number) => (width < COMPACT_BREAKPOINT ? COMPACT_METRICS : DESKTOP_METRICS);

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
}

export function computeLayout(tiers: Tier[], width: number, metrics: LayoutMetrics = metricsFor(width)): MapLayout {
  const perRow = Math.max(1, Math.floor(width / metrics.minColumn));
  const nodes: Record<string, Point> = {};
  const bands: TierBand[] = [];
  let top = 0;

  for (const tier of tiers) {
    const rows = chunk(tier.nodes, perRow);
    rows.forEach((row, r) => {
      const column = Math.min(metrics.maxColumn, width / row.length);
      const start = width / 2 - (column * (row.length - 1)) / 2;
      // Node centres sit in the upper part of the row; the label hangs below.
      const y = top + metrics.header + r * metrics.row + metrics.row * 0.36;
      row.forEach((id, i) => { nodes[id] = { x: start + i * column, y }; });
    });
    const height = metrics.header + rows.length * metrics.row;
    bands.push({ id: tier.id, label: tier.label, caption: tier.caption, top, height });
    top += height + metrics.gap;
  }

  return { width, height: Math.max(0, top - metrics.gap), nodes, tiers: bands };
}

// Smooth S-curve between tiers; nodes on the same row get a shallow arc so the line stays visible.
export function edgePath(a: Point, b: Point): string {
  if (Math.abs(a.y - b.y) < 1) {
    const lift = Math.min(36, Math.abs(b.x - a.x) * 0.25 + 12);
    return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${a.y - lift} ${b.x} ${b.y}`;
  }
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY} ${b.x} ${midY} ${b.x} ${b.y}`;
}
