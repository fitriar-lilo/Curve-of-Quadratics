import React, { useMemo } from 'react';

interface InteractiveGraphProps {
  a: number;
  b: number;
  c: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  points?: { x: number; y: number; label?: string; color?: string; radius?: number }[];
  highlightRoots?: boolean;
  highlightVertex?: boolean;
  highlightYIntercept?: boolean;
  showAxisOfSymmetry?: boolean;
  showGrid?: boolean;
  height?: number;
  width?: number;
  onPointClick?: (point: { x: number; y: number }) => void;
  probeX?: number | null;
  interactiveProbe?: boolean;
  onProbeChange?: (x: number) => void;
  userPoints?: { x: number; y: number; label?: string }[];
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  a,
  b,
  c,
  xMin = -6,
  xMax = 6,
  yMin = -8,
  yMax = 12,
  points = [],
  highlightRoots = false,
  highlightVertex = false,
  highlightYIntercept = false,
  showAxisOfSymmetry = false,
  showGrid = true,
  height = 360,
  probeX = null,
  interactiveProbe = false,
  onProbeChange,
  userPoints = [],
}) => {
  // Graph dimensions
  const svgWidth = 600;
  const svgHeight = height;
  const padding = 45;

  const innerWidth = svgWidth - padding * 2;
  const innerHeight = svgHeight - padding * 2;

  // Coordinate transforms
  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * innerWidth;
  const toSvgY = (y: number) => svgHeight - padding - ((y - yMin) / (yMax - yMin)) * innerHeight;

  const toMathX = (svgX: number) => {
    const clampedX = Math.max(padding, Math.min(svgWidth - padding, svgX));
    return xMin + ((clampedX - padding) / innerWidth) * (xMax - xMin);
  };

  // Generate grid tick values
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      ticks.push(x);
    }
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const step = (yMax - yMin) > 15 ? 2 : 1;
    const ticks: number[] = [];
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += step) {
      ticks.push(y);
    }
    return ticks;
  }, [yMin, yMax]);

  // Curve path calculation
  const curvePath = useMemo(() => {
    const steps = 120;
    const dx = (xMax - xMin) / steps;
    const pts: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = a * x * x + b * x + c;
      const sx = toSvgX(x);
      const sy = toSvgY(y);

      // Clamp y strictly within reasonable bounds to prevent huge SVG spikes
      const clampedSy = Math.max(-50, Math.min(svgHeight + 50, sy));

      if (i === 0) {
        pts.push(`M ${sx.toFixed(1)} ${clampedSy.toFixed(1)}`);
      } else {
        pts.push(`L ${sx.toFixed(1)} ${clampedSy.toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [a, b, c, xMin, xMax, innerWidth, innerHeight]);

  // Critical features
  // Vertex / Turning point: x = -b / (2a)
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  // Roots: ax^2 + bx + c = 0
  const discriminant = b * b - 4 * a * c;
  const roots: number[] = [];
  if (Math.abs(discriminant) < 1e-9) {
    roots.push(-b / (2 * a));
  } else if (discriminant > 0) {
    roots.push((-b - Math.sqrt(discriminant)) / (2 * a));
    roots.push((-b + Math.sqrt(discriminant)) / (2 * a));
  }

  // Y-intercept: (0, c)
  const yInterceptY = c;

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactiveProbe || !onProbeChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const mathX = toMathX((clientX / rect.width) * svgWidth);
    onProbeChange(Math.round(mathX * 10) / 10);
  };

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto select-none touch-none"
        onPointerMove={interactiveProbe ? handlePointer : undefined}
        onPointerDown={interactiveProbe ? handlePointer : undefined}
      >
        <defs>
          <pattern id="graph-minor-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Background Grid */}
        {showGrid && (
          <g className="grid-lines">
            {xTicks.map((x) => {
              const sx = toSvgX(x);
              return (
                <line
                  key={`gx-${x}`}
                  x1={sx}
                  y1={padding}
                  x2={sx}
                  y2={svgHeight - padding}
                  stroke={x === 0 ? 'none' : '#e2e8f0'}
                  strokeWidth="1"
                  strokeDasharray={x % 2 === 0 ? undefined : '2 2'}
                />
              );
            })}
            {yTicks.map((y) => {
              const sy = toSvgY(y);
              return (
                <line
                  key={`gy-${y}`}
                  x1={padding}
                  y1={sy}
                  x2={svgWidth - padding}
                  y2={sy}
                  stroke={y === 0 ? 'none' : '#e2e8f0'}
                  strokeWidth="1"
                  strokeDasharray={y % 2 === 0 ? undefined : '2 2'}
                />
              );
            })}
          </g>
        )}

        {/* X Axis */}
        <line
          x1={padding - 10}
          y1={originY}
          x2={svgWidth - padding + 15}
          y2={originY}
          stroke="#475569"
          strokeWidth="1.75"
          markerEnd="url(#arrow)"
        />
        {/* Y Axis */}
        <line
          x1={originX}
          y1={svgHeight - padding + 10}
          x2={originX}
          y2={padding - 15}
          stroke="#475569"
          strokeWidth="1.75"
          markerEnd="url(#arrow)"
        />

        {/* Axis Labels */}
        <text
          x={svgWidth - padding + 18}
          y={originY + 4}
          className="text-xs font-semibold fill-slate-700 italic font-mono"
        >
          x
        </text>
        <text
          x={originX - 14}
          y={padding - 18}
          className="text-xs font-semibold fill-slate-700 italic font-mono"
        >
          y
        </text>

        {/* Origin Label */}
        <text x={originX - 10} y={originY + 14} className="text-[11px] font-mono fill-slate-500">
          0
        </text>

        {/* X Ticks & Labels */}
        {xTicks.map((x) => {
          if (x === 0) return null;
          const sx = toSvgX(x);
          return (
            <g key={`xtick-${x}`}>
              <line x1={sx} y1={originY - 3} x2={sx} y2={originY + 3} stroke="#64748b" strokeWidth="1.5" />
              <text
                x={sx}
                y={originY + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-600 tabular-nums"
              >
                {x}
              </text>
            </g>
          );
        })}

        {/* Y Ticks & Labels */}
        {yTicks.map((y) => {
          if (y === 0) return null;
          const sy = toSvgY(y);
          return (
            <g key={`ytick-${y}`}>
              <line x1={originX - 3} y1={sy} x2={originX + 3} stroke="#64748b" strokeWidth="1.5" />
              <text
                x={originX - 8}
                y={sy + 3.5}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-600 tabular-nums"
              >
                {y}
              </text>
            </g>
          );
        })}

        {/* Axis of Symmetry */}
        {showAxisOfSymmetry && (
          <g>
            <line
              x1={toSvgX(vertexX)}
              y1={padding}
              x2={toSvgX(vertexX)}
              y2={svgHeight - padding}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={toSvgX(vertexX) + 6}
              y={padding + 14}
              className="text-[11px] font-mono font-medium fill-indigo-600"
            >
              x = {vertexX.toFixed(2).replace(/\.00$/, '')} (Axis of Symmetry)
            </text>
          </g>
        )}

        {/* The Main Quadratic Curve */}
        <clipPath id="graphClip">
          <rect x={padding} y={padding - 20} width={innerWidth} height={innerHeight + 40} />
        </clipPath>
        <path
          d={curvePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.75"
          clipPath="url(#graphClip)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight Y-Intercept */}
        {highlightYIntercept && yInterceptY >= yMin && yInterceptY <= yMax && (
          <g>
            <circle
              cx={originX}
              y={toSvgY(yInterceptY)}
              r="5.5"
              fill="#d97706"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <rect
              x={originX + 8}
              y={toSvgY(yInterceptY) - 12}
              width="85"
              height="20"
              rx="4"
              fill="#fffbeb"
              stroke="#fcd34d"
              strokeWidth="1"
            />
            <text
              x={originX + 13}
              y={toSvgY(yInterceptY) + 2}
              className="text-[10px] font-semibold font-mono fill-amber-800"
            >
              (0, {yInterceptY}) y-int
            </text>
          </g>
        )}

        {/* Highlight Roots (x-intercepts) */}
        {highlightRoots &&
          roots.map((r, i) => {
            if (r < xMin || r > xMax) return null;
            const rx = toSvgX(r);
            const ry = originY;
            return (
              <g key={`root-${i}`}>
                <circle cx={rx} cy={ry} r="5.5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                <rect
                  x={rx - 30}
                  y={ry + (a > 0 ? 10 : -28)}
                  width="60"
                  height="18"
                  rx="3"
                  fill="#fef2f2"
                  stroke="#fecaca"
                  strokeWidth="1"
                />
                <text
                  x={rx}
                  y={ry + (a > 0 ? 23 : -15)}
                  textAnchor="middle"
                  className="text-[10px] font-semibold font-mono fill-rose-800"
                >
                  Root ({r.toFixed(2).replace(/\.00$/, '')}, 0)
                </text>
              </g>
            );
          })}

        {/* Highlight Vertex / Turning Point */}
        {highlightVertex && vertexX >= xMin && vertexX <= xMax && vertexY >= yMin && vertexY <= yMax && (
          <g>
            <circle
              cx={toSvgX(vertexX)}
              cy={toSvgY(vertexY)}
              r="6.5"
              fill="#16a34a"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <rect
              x={toSvgX(vertexX) - 52}
              y={toSvgY(vertexY) + (a > 0 ? 12 : -32)}
              width="104"
              height="20"
              rx="4"
              fill="#f0fdf4"
              stroke="#bbf7d0"
              strokeWidth="1"
            />
            <text
              x={toSvgX(vertexX)}
              y={toSvgY(vertexY) + (a > 0 ? 26 : -18)}
              textAnchor="middle"
              className="text-[10px] font-semibold font-mono fill-emerald-800"
            >
              {a > 0 ? 'Min' : 'Max'} ({vertexX.toFixed(2).replace(/\.00$/, '')}, {vertexY.toFixed(2).replace(/\.00$/, '')})
            </text>
          </g>
        )}

        {/* Provided Points (e.g. from Table of Values) */}
        {points.map((p, idx) => {
          if (p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax) return null;
          const px = toSvgX(p.x);
          const py = toSvgY(p.y);
          const ptColor = p.color || '#4f46e5';
          return (
            <g key={`pt-${idx}`}>
              <circle
                cx={px}
                cy={py}
                r={p.radius || 4.5}
                fill={ptColor}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {p.label && (
                <text
                  x={px}
                  y={py - 8}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-medium fill-slate-700"
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        {/* User Plotting Points */}
        {userPoints.map((up, idx) => {
          if (up.x < xMin || up.x > xMax || up.y < yMin || up.y > yMax) return null;
          const px = toSvgX(up.x);
          const py = toSvgY(up.y);
          return (
            <g key={`user-pt-${idx}`}>
              <circle cx={px} cy={py} r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
              {up.label && (
                <text
                  x={px}
                  y={py - 9}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-semibold fill-orange-700"
                >
                  {up.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Interactive Probe Cursor */}
        {probeX !== null && probeX >= xMin && probeX <= xMax && (
          (() => {
            const probeY = a * probeX * probeX + b * probeX + c;
            const px = toSvgX(probeX);
            const py = toSvgY(probeY);
            return (
              <g>
                <line
                  x1={px}
                  y1={originY}
                  x2={px}
                  y2={py}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx={px} cy={py} r="5.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <rect
                  x={px - 45}
                  y={Math.max(padding + 2, py - 30)}
                  width="90"
                  height="20"
                  rx="4"
                  fill="#0f172a"
                  opacity="0.9"
                />
                <text
                  x={px}
                  y={Math.max(padding + 16, py - 16)}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-medium fill-white"
                >
                  ({probeX.toFixed(1)}, {probeY.toFixed(1)})
                </text>
              </g>
            );
          })()
        )}
      </svg>
    </div>
  );
};
