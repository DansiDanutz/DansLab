"use client";

import { bezierPath } from "@/lib/ecosystem-utils";
import type { ConnectionType } from "../data/connections";

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ConnectionType;
  isActive: boolean;
  isDimmed: boolean;
  id: string;
}

const typeStyles: Record<
  ConnectionType,
  { color: string; dash?: string; width: number }
> = {
  data: { color: "#3b82f6", width: 1.5 },
  ssh: { color: "#22c55e", dash: "6 4", width: 1.5 },
  deploy: { color: "#f97316", dash: "3 3", width: 1.5 },
  monitor: { color: "#eab308", dash: "8 4", width: 1 },
  comms: { color: "#6366f1", width: 1 },
};

export default function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  type,
  isActive,
  isDimmed,
  id,
}: ConnectionLineProps) {
  const style = typeStyles[type];
  const d = bezierPath(x1, y1, x2, y2);

  return (
    <g>
      <path
        id={`path-${id}`}
        d={d}
        fill="none"
        stroke={style.color}
        strokeWidth={isActive ? style.width + 1 : style.width}
        strokeDasharray={style.dash}
        opacity={isDimmed ? 0.08 : isActive ? 0.8 : 0.2}
        style={{
          transition: "opacity 0.4s ease, stroke-width 0.3s ease",
        }}
      />
      {/* Flow particle along path */}
      {(isActive || !isDimmed) && (
        <>
          <circle r={isActive ? 3 : 2} fill={style.color} opacity={isActive ? 0.9 : 0.4}>
            <animateMotion
              dur={isActive ? "2s" : "4s"}
              repeatCount="indefinite"
              path={d}
            />
          </circle>
          {isActive && (
            <circle r={2} fill={style.color} opacity={0.6}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={d}
                begin="1s"
              />
            </circle>
          )}
        </>
      )}
    </g>
  );
}
