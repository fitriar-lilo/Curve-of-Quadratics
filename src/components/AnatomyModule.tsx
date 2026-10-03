import React, { useState, useMemo } from 'react';
import { InteractiveGraph } from './InteractiveGraph';
import { Check, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface AnatomyModuleProps {
  onContinue: () => void;
}

export const AnatomyModule: React.FC<AnatomyModuleProps> = ({ onContinue }) => {
  // Quadratic coefficients: y = ax^2 + bx + c
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(3);

  // Toggles for visual annotations
  const [showRoots, setShowRoots] = useState<boolean>(true);
  const [showVertex, setShowVertex] = useState<boolean>(true);
  const [showAxisOfSymmetry, setShowAxisOfSymmetry] = useState<boolean>(true);
  const [showYIntercept, setShowYIntercept] = useState<boolean>(true);

  // Mathematical properties
  const vertexX = useMemo(() => -b / (2 * a), [a, b]);
  const vertexY = useMemo(() => a * vertexX * vertexX + b * vertexX + c, [a, b, c, vertexX]);
  const isMinimum = a > 0;

  const discriminant = useMemo(() => b * b - 4 * a * c, [a, b, c]);

  const roots = useMemo(() => {
    if (discriminant < 0) return [];
    if (Math.abs(discriminant) < 1e-9) {
      return [-b / (2 * a)];
    }
    const r1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    return [Math.min(r1, r2), Math.max(r1, r2)];
  }, [a, b, discriminant]);

  // Form factorised string if integer roots
  const factorisedString = useMemo(() => {
    if (roots.length === 2 && Number.isInteger(roots[0]) && Number.isInteger(roots[1])) {
      const r1 = roots[0];
      const r2 = roots[1];
      const prefix = a !== 1 ? `${a}` : '';
      const t1 = r1 > 0 ? `(x - ${r1})` : r1 < 0 ? `(x + ${Math.abs(r1)})` : 'x';
      const t2 = r2 > 0 ? `(x - ${r2})` : r2 < 0 ? `(x + ${Math.abs(r2)})` : 'x';
      return `y = ${prefix}${t1}${t2}`;
    }
    return null;
  }, [roots, a]);

  // Completed square form
  const completedSquareString = useMemo(() => {
    const h = -vertexX;
    const hSign = h > 0 ? `+ ${h.toFixed(1).replace(/\.0$/, '')}` : `- ${Math.abs(h).toFixed(1).replace(/\.0$/, '')}`;
    const kSign = vertexY >= 0 ? `+ ${vertexY.toFixed(1).replace(/\.0$/, '')}` : `- ${Math.abs(vertexY).toFixed(1).replace(/\.0$/, '')}`;
    const aPrefix = a !== 1 ? `${a}` : '';
    return `y = ${aPrefix}(x ${hSign})² ${kSign}`;
  }, [a, vertexX, vertexY]);

  const equationString = useMemo(() => {
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
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Cambridge IGCSE 0580 · Curved Graphs
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Part 2: The Anatomy of a Parabola — Roots & Turning Point
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Teacher: Fitriar</span>
            <span>·</span>
            <span>Semesta Mathematics</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Every quadratic curve $y = ax^2 + bx + c$ has signature landmarks that Cambridge examiners test in almost every exam series.
          Use the interactive sliders below to explore how varying $a, b, c$ shifts the <strong>Turning Point (Vertex)</strong>, changes the <strong>Roots</strong>, and reveals the <strong>Axis of Symmetry</strong>.
        </p>
      </div>

      {/* Main Grid: Graph + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Live Interactive Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              {equationString}
            </div>

            {/* Visual Feature Toggles */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="flex items-center gap-1 cursor-pointer text-rose-700">
                <input
                  type="checkbox"
                  checked={showRoots}
                  onChange={(e) => setShowRoots(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium">Roots (x-int)</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-emerald-700">
                <input
                  type="checkbox"
                  checked={showVertex}
                  onChange={(e) => setShowVertex(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium">Turning Point</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-indigo-700">
                <input
                  type="checkbox"
                  checked={showAxisOfSymmetry}
                  onChange={(e) => setShowAxisOfSymmetry(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium">Symmetry</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-amber-700">
                <input
                  type="checkbox"
                  checked={showYIntercept}
                  onChange={(e) => setShowYIntercept(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium">y-int</span>
              </label>
            </div>
          </div>

          <InteractiveGraph
            a={a}
            b={b}
            c={c}
            xMin={-6}
            xMax={6}
            yMin={-8}
            yMax={12}
            highlightRoots={showRoots}
            highlightVertex={showVertex}
            highlightYIntercept={showYIntercept}
            showAxisOfSymmetry={showAxisOfSymmetry}
            height={390}
          />

          {/* Quick Coefficient Sliders */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Coefficient Controls: y = ax² + bx + c
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Slider a */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">a (Direction / Width)</span>
                  <span className="font-mono font-bold text-indigo-600">{a}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={a}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val !== 0) setA(val);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">
                  {a > 0 ? 'a > 0: U-shape (Minimum)' : 'a < 0: ∩-shape (Maximum)'}
                </div>
              </div>

              {/* Slider b */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">b (Horizontal Shift)</span>
                  <span className="font-mono font-bold text-indigo-600">{b}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">
                  Axis of symmetry: x = {-b / (2 * a)}
                </div>
              </div>

              {/* Slider c */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">c (Vertical / y-int)</span>
                  <span className="font-mono font-bold text-indigo-600">{c}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">
                  Crosses y-axis at (0, {c})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Pedagogical Theory & Step-by-Step Derivation */}
        <div className="lg:col-span-5 space-y-4">
          {/* Concept 1: Turning Point */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Turning Point (Vertex)
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ({vertexX.toFixed(2).replace(/\.00$/, '')}, {vertexY.toFixed(2).replace(/\.00$/, '')})
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>What is it?</strong> The point where the curve stops falling and begins rising (or vice versa).
              Because <span className="font-mono">a = {a}</span> ({a > 0 ? 'positive' : 'negative'}), this is a{' '}
              <strong className="text-emerald-800">{isMinimum ? 'MINIMUM' : 'MAXIMUM'}</strong> turning point.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="text-slate-500 text-[11px]">How to calculate in IGCSE 0580:</div>
              <div>x = -b / (2a) = -({b}) / (2 × {a}) = <strong className="text-indigo-700">{vertexX.toFixed(2).replace(/\.00$/, '')}</strong></div>
              <div>y = f({vertexX.toFixed(2).replace(/\.00$/, '')}) = <strong className="text-emerald-700">{vertexY.toFixed(2).replace(/\.00$/, '')}</strong></div>
              <div className="pt-1 border-t border-slate-200 text-slate-700">
                Completed Square Form: <span className="text-indigo-800 font-semibold">{completedSquareString}</span>
              </div>
            </div>
          </div>

          {/* Concept 2: Roots */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h3 className="text-sm font-bold text-slate-900">
                  2. Roots (x-intercepts)
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                {roots.length === 2
                  ? `x = ${roots[0].toFixed(2).replace(/\.00$/, '')}, ${roots[1].toFixed(2).replace(/\.00$/, '')}`
                  : roots.length === 1
                  ? `x = ${roots[0].toFixed(2).replace(/\.00$/, '')}`
                  : 'No real roots'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>What are they?</strong> The values of $x$ where the curve cuts the $x$-axis (where $y = 0$).
              We solve the equation <span className="font-mono">ax² + bx + c = 0</span>.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Discriminant Δ = b² - 4ac:</span>
                <span className="font-bold text-indigo-700">
                  ({b})² - 4({a})({c}) = {discriminant}
                </span>
              </div>

              <div className="text-[11px] text-slate-600">
                {discriminant > 0 && 'Δ > 0: The curve intersects the x-axis at 2 distinct real points.'}
                {discriminant === 0 && 'Δ = 0: Exactly 1 repeated root. The turning point lies directly ON the x-axis!'}
                {discriminant < 0 && 'Δ < 0: No real roots. The curve is completely suspended above or below the x-axis.'}
              </div>

              {factorisedString && (
                <div className="text-xs font-mono text-indigo-800 bg-indigo-50/60 p-1.5 rounded">
                  Factorised Form: <strong>{factorisedString}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Concept 3: y-Intercept & Symmetry */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              3. y-Intercept & Axis of Symmetry
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">y-Intercept: (0, c)</div>
                <div className="text-slate-600">
                  Substitute x = 0:
                </div>
                <div className="font-mono font-bold text-amber-800 mt-1">
                  (0, {c})
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-lg">
                <div className="font-semibold text-indigo-900 mb-1">Axis of Symmetry</div>
                <div className="text-slate-600">
                  Vertical line through vertex:
                </div>
                <div className="font-mono font-bold text-indigo-800 mt-1">
                  x = {vertexX.toFixed(2).replace(/\.00$/, '')}
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <span>Next: Sketching Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
