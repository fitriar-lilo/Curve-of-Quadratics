import React, { useState, useMemo } from 'react';
import { InteractiveGraph } from './InteractiveGraph';
import { Info, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PointCollectionModuleProps {
  onContinue: () => void;
}

export const PointCollectionModule: React.FC<PointCollectionModuleProps> = ({ onContinue }) => {
  // Equation coefficients: y = ax^2 + bx + c
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);

  // Discrete points revealed by the student
  const [revealedPoints, setRevealedPoints] = useState<number[]>([-3, -2, -1, 0, 1, 2, 3, 4]);
  // Point density slider: from 5 discrete points to 50 continuous points
  const [pointDensity, setPointDensity] = useState<number>(8);
  const [showSmoothCurve, setShowSmoothCurve] = useState<boolean>(true);
  const [probeX, setProbeX] = useState<number>(1);

  // Table of values calculation for integer x between -3 and 4
  const tableData = useMemo(() => {
    const xs = [-3, -2, -1, 0, 1, 2, 3, 4];
    return xs.map((x) => {
      const xSq = x * x;
      const axSq = a * xSq;
      const bx = b * x;
      const y = axSq + bx + c;
      return { x, xSq, axSq, bx, c, y };
    });
  }, [a, b, c]);

  // Differences calculation (1st and 2nd difference)
  const differenceAnalysis = useMemo(() => {
    const deltas: { x1: number; x2: number; deltaY: number }[] = [];
    for (let i = 0; i < tableData.length - 1; i++) {
      deltas.push({
        x1: tableData[i].x,
        x2: tableData[i + 1].x,
        deltaY: tableData[i + 1].y - tableData[i].y,
      });
    }

    const secondDeltas: number[] = [];
    for (let i = 0; i < deltas.length - 1; i++) {
      secondDeltas.push(deltas[i + 1].deltaY - deltas[i].deltaY);
    }

    return { deltas, secondDeltas };
  }, [tableData]);

  // Points to show on graph based on density slider
  const dynamicPoints = useMemo(() => {
    const pts: { x: number; y: number; label?: string; color?: string; radius?: number }[] = [];
    const minX = -3;
    const maxX = 4;
    const step = (maxX - minX) / (pointDensity - 1);

    for (let i = 0; i < pointDensity; i++) {
      const x = minX + i * step;
      const y = a * x * x + b * x + c;
      const isInteger = Math.abs(x - Math.round(x)) < 0.001;
      pts.push({
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        label: isInteger && pointDensity <= 10 ? `(${x}, ${y})` : undefined,
        color: '#4338ca',
        radius: pointDensity > 20 ? 3 : 4.5,
      });
    }
    return pts;
  }, [a, b, c, pointDensity]);

  const presetEquations = [
    { label: 'y = x² - 2x - 3', a: 1, b: -2, c: -3, desc: 'Classic standard quadratic with 2 distinct roots' },
    { label: 'y = -x² + 4', a: -1, b: 0, c: 4, desc: 'Inverted parabola with maximum at (0, 4)' },
    { label: 'y = x² - 4x + 4', a: 1, b: -4, c: 4, desc: 'Repeated root where turning point touches axis' },
    { label: 'y = 0.5x² + x - 2', a: 0.5, b: 1, c: -2, desc: 'Wider quadratic with fractional coefficient' },
  ];

  const handleSelectPreset = (p: typeof presetEquations[0]) => {
    setA(p.a);
    setB(p.b);
    setC(p.c);
  };

  const togglePointReveal = (x: number) => {
    if (revealedPoints.includes(x)) {
      setRevealedPoints(revealedPoints.filter((pt) => pt !== x));
    } else {
      setRevealedPoints([...revealedPoints, x]);
    }
  };

  const currentEquationString = useMemo(() => {
    let str = 'y = ';
    if (a === 1) str += 'x²';
    else if (a === -1) str += '-x²';
    else str += `${a}x²`;

    if (b > 0) str += ` + ${b === 1 ? '' : b}x`;
    else if (b < 0) str += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;

    if (c > 0) str += ` + ${c}`;
    else if (c < 0) str += ` - ${Math.abs(c)}`;
    return str;
  }, [a, b, c]);

  return (
    <div className="space-y-8 pb-12">
      {/* Teacher Framing Intro */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Cambridge IGCSE 0580 · Curved Graphs
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Part 1: The Curve as an Infinite Collection of Points
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Teacher: Fitriar</span>
            <span>·</span>
            <span>Semesta Mathematics</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          In primary and lower secondary math, you learned that straight lines have a constant gradient ($m$).
          However, curved graphs like quadratics ($y = ax^2 + bx + c$) possess a <strong>gradient that continuously changes</strong> at every single location.
          Mathematically, a curve is not a single drawn object—it is <strong>an infinite collection of discrete coordinate pairs $(x, y)$</strong> satisfying the quadratic rule.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          Select an Equation to Investigate:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetEquations.map((preset) => {
            const isSelected = a === preset.a && b === preset.b && c === preset.c;
            return (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
                }`}
              >
                <div className="font-mono font-semibold text-slate-900 text-sm">
                  {preset.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Zone Sandbox: Stage & Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive Stage (Graph) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {currentEquationString}
              </span>
              <span className="text-xs text-slate-500">Coordinate Grid</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={showSmoothCurve}
                  onChange={(e) => setShowSmoothCurve(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Render Smooth Line</span>
              </label>
            </div>
          </div>

          <InteractiveGraph
            a={showSmoothCurve ? a : 0}
            b={showSmoothCurve ? b : 0}
            c={showSmoothCurve ? c : -999}
            xMin={-5}
            xMax={6}
            yMin={-8}
            yMax={12}
            points={dynamicPoints}
            height={380}
            interactiveProbe={true}
            probeX={probeX}
            onProbeChange={setProbeX}
          />

          {/* Interactive Density Experiment Slider */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Point Collection Density Experiment:
              </span>
              <span className="font-mono text-indigo-600 font-semibold tabular-nums">
                {pointDensity} Discrete Points Plotted
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="50"
              step="1"
              value={pointDensity}
              onChange={(e) => setPointDensity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Few dots (Discrete)</span>
              <span>Medium density</span>
              <span>Smooth curve limit (Continuous)</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Notice: As point density increases from 4 to 50, the individual dots merge into what human eyes perceive as a continuous solid curve! In mathematics, a curve <em>is</em> the infinite set of all points satisfying the equation.
            </p>
          </div>
        </div>

        {/* Right Zone: Concept Deck & Table of Values */}
        <div className="lg:col-span-5 space-y-5">
          {/* Table of Values (Cambridge IGCSE 0580 Core Skill) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Table of Values (IGCSE 0580 Method)
              </h3>
              <span className="text-xs text-slate-500 font-mono">x ∈ [-3, 4]</span>
            </div>

            <p className="text-xs text-slate-600">
              In Paper 2 & Paper 4, Cambridge frequently asks students to complete missing values in a table before plotting:
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-2 px-3 font-semibold">x</th>
                    <th className="py-2 px-3 font-semibold">x²</th>
                    <th className="py-2 px-3 font-semibold">{a !== 1 ? `${a}x²` : 'ax²'}</th>
                    <th className="py-2 px-3 font-semibold">{b}x</th>
                    <th className="py-2 px-3 font-semibold">{c >= 0 ? `+${c}` : c}</th>
                    <th className="py-2 px-3 font-bold bg-indigo-50/80 text-indigo-900">y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableData.map((row) => {
                    const isProbe = Math.round(probeX) === row.x;
                    return (
                      <tr
                        key={row.x}
                        className={`transition-colors cursor-pointer ${
                          isProbe ? 'bg-amber-50 font-bold' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setProbeX(row.x)}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.x}</td>
                        <td className="py-2 px-3 text-slate-600">{row.xSq}</td>
                        <td className="py-2 px-3 text-slate-600">{row.axSq}</td>
                        <td className="py-2 px-3 text-slate-600">{row.bx}</td>
                        <td className="py-2 px-3 text-slate-600">{row.c}</td>
                        <td className="py-2 px-3 font-bold text-indigo-700 bg-indigo-50/40">
                          {row.y}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cambridge Insight: Second Difference */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>The Mathematical Secret: 2nd Difference</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Notice the difference between consecutive y-values (1st difference):
                <span className="font-mono text-slate-800 ml-1">
                  [{differenceAnalysis.deltas.slice(0, 5).map((d) => d.deltaY).join(', ')}, ...]
                </span>
                . It is NOT constant!
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                Now take the difference of the differences (2nd difference):
                <span className="font-mono font-bold text-indigo-700 ml-1">
                  Δ²y = {differenceAnalysis.secondDeltas[0]}
                </span>
                . For every quadratic equation, the 2nd difference is always constant and equal to{' '}
                <strong className="text-indigo-800">2a</strong> ({2 * a})! This proves it generates a quadratic curve rather than a line.
              </p>
            </div>
          </div>

          {/* Interactive Probe Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Coordinate Probe
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">
                  Scrub x coordinate: <span className="font-mono font-bold text-slate-900">{probeX.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="-4"
                  max="5"
                  step="0.1"
                  value={probeX}
                  onChange={(e) => setProbeX(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-center shrink-0">
                <div className="text-[11px] text-slate-500">Calculated y</div>
                <div className="text-base font-mono font-bold text-indigo-700">
                  {(a * probeX * probeX + b * probeX + c).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <span>Next: Turning Point & Roots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
