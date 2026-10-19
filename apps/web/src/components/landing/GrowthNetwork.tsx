"use client";

import { useMemo } from "react";

type PathSpec = {
  d: string;
  color: string;
  delay: string;
  markerId: string;
};

const PATHS: PathSpec[] = [
  {
    d: "M 40 90 C 120 70, 180 40, 280 55",
    color: "#e11d48",
    delay: "0s",
    markerId: "g-arrow-0",
  },
  {
    d: "M 50 150 C 140 160, 220 110, 340 95",
    color: "#2563eb",
    delay: "0.25s",
    markerId: "g-arrow-1",
  },
  {
    d: "M 60 200 C 160 210, 240 160, 380 130",
    color: "#3f7a52",
    delay: "0.45s",
    markerId: "g-arrow-2",
  },
  {
    d: "M 80 240 C 180 250, 280 220, 420 200",
    color: "#ea580c",
    delay: "0.65s",
    markerId: "g-arrow-3",
  },
  {
    d: "M 100 70 C 200 50, 300 80, 440 60",
    color: "#db2777",
    delay: "0.15s",
    markerId: "g-arrow-4",
  },
];

function buildNodes(cols: number, rows: number) {
  const nodes: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = ((r * 17 + c * 11) % 7) - 3;
      const jitterY = ((r * 13 + c * 19) % 7) - 3;
      nodes.push({
        x: 36 + c * 52 + jitterX,
        y: 36 + r * 42 + jitterY,
      });
    }
  }
  return nodes;
}

/** Mesh + animated growth paths — pure SVG/CSS, no animation libraries. */
export function GrowthNetwork() {
  const nodes = useMemo(() => buildNodes(9, 6), []);

  const links = useMemo(() => {
    const edges: [number, number][] = [];
    const cols = 9;
    nodes.forEach((_, i) => {
      const right = i + 1;
      const down = i + cols;
      if (i % cols < cols - 1) edges.push([i, right]);
      if (down < nodes.length) edges.push([i, down]);
      if (i % cols < cols - 1 && down + 1 < nodes.length) {
        edges.push([i, down + 1]);
      }
    });
    return edges;
  }, [nodes]);

  return (
    <div className="growth-network relative overflow-hidden rounded-[28px] border border-line bg-[#f3ebe1]">
      <svg
        viewBox="0 0 500 280"
        className="h-auto w-full"
        role="img"
        aria-label="Business growth network connecting inventory, pricing, and profit"
      >
        <defs>
          {PATHS.map((p) => (
            <marker
              key={p.markerId}
              id={p.markerId}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill={p.color} />
            </marker>
          ))}
        </defs>

        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(26,18,16,0.08)"
            strokeWidth="1"
          />
        ))}

        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="3.2"
            fill="none"
            stroke="rgba(26,18,16,0.35)"
            strokeWidth="1.2"
          />
        ))}

        {PATHS.map((p) => (
          <path
            key={p.markerId}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth="2.6"
            strokeLinecap="round"
            pathLength={1}
            className="growth-path"
            style={{ animationDelay: p.delay }}
            markerEnd={`url(#${p.markerId})`}
          />
        ))}
      </svg>
    </div>
  );
}
