import React, { useState } from 'react';
import { InteractiveGraph } from './InteractiveGraph';
import { CheckCircle2, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface SketchingGuideModuleProps {
  onContinue: () => void;
}

export const SketchingGuideModule: React.FC<SketchingGuideModuleProps> = ({ onContinue }) => {
  // Challenge problem for the student to practice sketching
  // Problem: y = x^2 - 6x + 5
  // a = 1, b = -6, c = 5
  // Roots: (x - 1)(x - 5) = 0 -> x = 1, x = 5
  // Vertex: x = 3, y = 3^2 - 18 + 5 = -4 -> (3, -4)
  // y-intercept: (0, 5)

  const [shapeAnswer, setShapeAnswer] = useState<'min' | 'max' | ''>('');
  const [yInterceptAnswer, setYInterceptAnswer] = useState<string>('');
  const [root1Answer, setRoot1Answer] = useState<string>('');
  const [root2Answer, setRoot2Answer] = useState<string>('');
  const [vertexXAnswer, setVertexXAnswer] = useState<string>('');
  const [vertexYAnswer, setVertexYAnswer] = useState<string>('');

  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const isShapeCorrect = shapeAnswer === 'min';
  const isYInterceptCorrect = Number(yInterceptAnswer) === 5;
  const rootsEntered = [Number(root1Answer), Number(root2Answer)].sort((a, b) => a - b);
  const isRootsCorrect = rootsEntered[0] === 1 && rootsEntered[1] === 5;
  const isVertexCorrect = Number(vertexXAnswer) === 3 && Number(vertexYAnswer) === -4;

  const allCorrect = isShapeCorrect && isYInterceptCorrect && isRootsCorrect && isVertexCorrect;

  // Points plotted based on student input
  const userPlacedPoints: { x: number; y: number; label?: string }[] = [];
  if (yInterceptAnswer !== '' && !isNaN(Number(yInterceptAnswer))) {
    userPlacedPoints.push({ x: 0, y: Number(yInterceptAnswer), label: `(0, ${yInterceptAnswer})` });
  }
  if (root1Answer !== '' && !isNaN(Number(root1Answer))) {
    userPlacedPoints.push({ x: Number(root1Answer), y: 0, label: `x=${root1Answer}` });
  }
  if (root2Answer !== '' && !isNaN(Number(root2Answer))) {
    userPlacedPoints.push({ x: Number(root2Answer), y: 0, label: `x=${root2Answer}` });
  }
  if (vertexXAnswer !== '' && vertexYAnswer !== '' && !isNaN(Number(vertexXAnswer)) && !isNaN(Number(vertexYAnswer))) {
    userPlacedPoints.push({ x: Number(vertexXAnswer), y: Number(vertexYAnswer), label: `Vertex (${vertexXAnswer}, ${vertexYAnswer})` });
  }

  const handleFillCorrect = () => {
    setShapeAnswer('min');
    setYInterceptAnswer('5');
    setRoot1Answer('1');
    setRoot2Answer('5');
    setVertexXAnswer('3');
    setVertexYAnswer('-4');
    setHasChecked(true);
  };

  const handleReset = () => {
    setShapeAnswer('');
    setYInterceptAnswer('');
    setRoot1Answer('');
    setRoot2Answer('');
    setVertexXAnswer('');
    setVertexYAnswer('');
    setHasChecked(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Cambridge IGCSE 0580 · Examination Technique
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Part 3: The 4-Step Master Strategy for Sketching Quadratics
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Teacher: Fitriar</span>
            <span>·</span>
            <span>Semesta Mathematics</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          In Cambridge IGCSE 0580 papers, the command word <strong>"Sketch"</strong> has a precise mathematical meaning:
          you do not need graph paper to plot 20 points, but you <strong>must clearly show and label the 4 essential landmarks</strong>.
        </p>
      </div>

      {/* The 4-Step Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Step 1
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              Parabola Shape
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Examine the sign of coefficient <strong className="font-mono">a</strong>:
            </p>
            <ul className="text-xs text-slate-600 mt-2 space-y-1">
              <li>• <span className="font-mono font-semibold text-emerald-700">a &gt; 0</span>: U-shape smile (Minimum)</li>
              <li>• <span className="font-mono font-semibold text-rose-700">a &lt; 0</span>: ∩-shape frown (Maximum)</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            1 mark in Cambridge criteria
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Step 2
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              y-Intercept
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The curve crosses the y-axis when <span className="font-mono font-semibold">x = 0</span>.
            </p>
            <div className="bg-slate-50 font-mono text-xs text-slate-800 p-2.5 rounded mt-2 border border-slate-200">
              y = a(0)² + b(0) + c<br />
              <strong>Coordinate: (0, c)</strong>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Instant free mark
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Step 3
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              Roots (x-intercepts)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Set <span className="font-mono font-semibold">y = 0</span> and solve the quadratic:
            </p>
            <div className="bg-slate-50 font-mono text-xs text-slate-800 p-2.5 rounded mt-2 border border-slate-200">
              ax² + bx + c = 0<br />
              Factorise or use formula
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Label (r₁, 0) and (r₂, 0)
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              Step 4
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-1">
              Turning Point (Vertex)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Find the midpoint of roots or use formula:
            </p>
            <div className="bg-slate-50 font-mono text-xs text-slate-800 p-2.5 rounded mt-2 border border-slate-200">
              x = -b / (2a)<br />
              Substitute x to find y
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Label Vertex (x, y) clearly
          </div>
        </div>
      </div>

      {/* Interactive Workout: "Sketch It Yourself" */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Interactive Practice Studio
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Task: Sketch the curve y = x² - 6x + 5
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFillCorrect}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Reveal Sample Answers
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input parameters */}
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs text-slate-600">
              Calculate the 4 critical features for <span className="font-mono font-bold text-indigo-700">y = x² - 6x + 5</span> and enter them below. Watch your points appear in real time on the graph!
            </p>

            {/* Feature 1: Shape */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                1. Orientation of Parabola:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="shape"
                    value="min"
                    checked={shapeAnswer === 'min'}
                    onChange={() => setShapeAnswer('min')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>U-shape / Minimum (a &gt; 0)</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="shape"
                    value="max"
                    checked={shapeAnswer === 'max'}
                    onChange={() => setShapeAnswer('max')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>∩-shape / Maximum (a &lt; 0)</span>
                </label>
              </div>
            </div>

            {/* Feature 2: y-Intercept */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                2. y-Intercept Coordinate: (0, y)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span>(0,</span>
                <input
                  type="number"
                  placeholder="y value"
                  value={yInterceptAnswer}
                  onChange={(e) => setYInterceptAnswer(e.target.value)}
                  className="w-24 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span>)</span>
              </div>
            </div>

            {/* Feature 3: Roots */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                3. Roots / x-Intercepts: Solve x² - 6x + 5 = 0
              </label>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span>x₁ =</span>
                  <input
                    type="number"
                    placeholder="Root 1"
                    value={root1Answer}
                    onChange={(e) => setRoot1Answer(e.target.value)}
                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <span className="text-slate-400">and</span>
                <div className="flex items-center gap-1.5">
                  <span>x₂ =</span>
                  <input
                    type="number"
                    placeholder="Root 2"
                    value={root2Answer}
                    onChange={(e) => setRoot2Answer(e.target.value)}
                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Feature 4: Turning Point */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                4. Turning Point Coordinates: (x, y)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span>(</span>
                <input
                  type="number"
                  placeholder="x (axis of symmetry)"
                  value={vertexXAnswer}
                  onChange={(e) => setVertexXAnswer(e.target.value)}
                  className="w-24 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span>,</span>
                <input
                  type="number"
                  placeholder="y (minimum value)"
                  value={vertexYAnswer}
                  onChange={(e) => setVertexYAnswer(e.target.value)}
                  className="w-24 px-2.5 py-1.5 border border-slate-300 rounded font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span>)</span>
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={() => setHasChecked(true)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              Verify My Sketch Values
            </button>

            {hasChecked && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-2 ${
                  allCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {allCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Perfect! Full 4 Marks in Cambridge 0580!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Review Your Sketch Features:</span>
                    </>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div>• Orientation: {isShapeCorrect ? '✅ Correct (Minimum U-shape)' : '❌ Incorrect (a = 1 > 0, so it opens upwards)'}</div>
                  <div>• y-Intercept: {isYInterceptCorrect ? '✅ Correct (0, 5)' : '❌ Incorrect (when x=0, y=5)'}</div>
                  <div>• Roots: {isRootsCorrect ? '✅ Correct (x=1 and x=5)' : '❌ Incorrect (factorises as (x - 1)(x - 5) = 0)'}</div>
                  <div>• Turning Point: {isVertexCorrect ? '✅ Correct (3, -4)' : '❌ Incorrect (x = 6/2 = 3; y = 3² - 18 + 5 = -4)'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Graph verification */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Target Curve: y = x² - 6x + 5</span>
              <span className="text-orange-600 font-medium">🟠 Your Plotted Points</span>
            </div>

            <InteractiveGraph
              a={1}
              b={-6}
              c={5}
              xMin={-1}
              xMax={7}
              yMin={-6}
              yMax={8}
              highlightRoots={hasChecked && allCorrect}
              highlightVertex={hasChecked && allCorrect}
              highlightYIntercept={hasChecked && allCorrect}
              showAxisOfSymmetry={hasChecked && allCorrect}
              userPoints={userPlacedPoints}
              height={360}
            />

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Examiner Note:</strong> When drawing by hand on IGCSE papers, remember to draw a single, continuous smooth curve through the points. Never use a ruler to connect points on a quadratic curve!
            </div>
          </div>
        </div>
      </div>

      {/* Next Step */}
      <div className="flex items-center justify-end">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <span>Continue to Graded Exercises (1 Mark each)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
