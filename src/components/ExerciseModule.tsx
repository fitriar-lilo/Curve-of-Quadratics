import React, { useState } from 'react';
import { ExerciseQuestion } from '../types/math';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RefreshCw, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseModuleProps {
  questions: ExerciseQuestion[];
  onUpdateQuestion: (id: number, answer: string | number, isCorrect: boolean) => void;
  onResetAll: () => void;
  onGoToSubmission: () => void;
  score: number;
}

export const initialQuestions: ExerciseQuestion[] = [
  {
    id: 1,
    title: 'Question 1: Table of Values & Points',
    syllabusRef: 'Cambridge 0580/22/M/J/21 Q14',
    prompt: 'Complete the table of values for the quadratic curve y = x² - 3x + 1. Calculate the value of y when x = 4.',
    equationDisplay: 'y = x² - 3x + 1, find y when x = 4',
    type: 'numeric',
    correctAnswer: 5,
    hint: 'Substitute x = 4 into the equation: (4)² - 3(4) + 1.',
    explanation: 'Substitute x = 4: y = (4)² - 3(4) + 1 = 16 - 12 + 1 = 5. Therefore, the point on the curve is (4, 5). [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 2,
    title: 'Question 2: Parabola Orientation',
    syllabusRef: 'Cambridge 0580/41/O/N/22 Q6',
    prompt: 'State whether the quadratic curve y = -2x² + 8x - 3 has a maximum turning point or a minimum turning point.',
    equationDisplay: 'y = -2x² + 8x - 3',
    type: 'multiple-choice',
    options: [
      { label: 'Maximum turning point (opens downwards ∩)', value: 'Maximum' },
      { label: 'Minimum turning point (opens upwards ∪)', value: 'Minimum' },
    ],
    correctAnswer: 'Maximum',
    hint: 'Look at the coefficient of x². If a < 0, the curve frowns, giving a highest peak.',
    explanation: 'The coefficient of x² is a = -2. Because a < 0 (negative), the parabola opens downwards in an inverted U-shape, reaching a MAXIMUM turning point. [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 3,
    title: 'Question 3: y-Intercept',
    syllabusRef: 'Cambridge 0580/23/M/J/20 Q9',
    prompt: 'Find the coordinates of the point where the curve y = 3x² - 5x - 7 intersects the y-axis.',
    equationDisplay: 'y = 3x² - 5x - 7',
    type: 'multiple-choice',
    options: [
      { label: '(0, -7)', value: '(0, -7)' },
      { label: '(-7, 0)', value: '(-7, 0)' },
      { label: '(0, 7)', value: '(0, 7)' },
      { label: '(3, -7)', value: '(3, -7)' },
    ],
    correctAnswer: '(0, -7)',
    hint: 'A curve cuts the y-axis where x = 0.',
    explanation: 'To find the y-intercept, set x = 0: y = 3(0)² - 5(0) - 7 = -7. The coordinate must be written as (0, -7). [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 4,
    title: 'Question 4: Roots from Factorised Form',
    syllabusRef: 'Cambridge 0580/42/M/J/22 Q11',
    prompt: 'The curve y = (x - 4)(x + 2) cuts the x-axis at two points. State the value of the positive root.',
    equationDisplay: 'y = (x - 4)(x + 2) = 0',
    type: 'numeric',
    correctAnswer: 4,
    hint: 'Set y = 0: (x - 4)(x + 2) = 0. Solve for x.',
    explanation: 'Set y = 0: (x - 4)(x + 2) = 0 gives roots x = 4 and x = -2. The question asks specifically for the positive root, which is x = 4. [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 5,
    title: 'Question 5: Axis of Symmetry',
    syllabusRef: 'Cambridge 0580/21/O/N/21 Q18',
    prompt: 'Calculate the equation of the line of symmetry for the quadratic curve y = x² - 8x + 11.',
    equationDisplay: 'y = x² - 8x + 11',
    type: 'multiple-choice',
    options: [
      { label: 'x = 4', value: 'x = 4' },
      { label: 'x = -4', value: 'x = -4' },
      { label: 'x = 8', value: 'x = 8' },
      { label: 'y = 4', value: 'y = 4' },
    ],
    correctAnswer: 'x = 4',
    hint: 'The axis of symmetry formula is x = -b / (2a).',
    explanation: 'Here a = 1, b = -8. Line of symmetry formula: x = -b / (2a) = -(-8) / (2 × 1) = 8 / 2 = 4. The line of symmetry is a vertical line with equation x = 4. [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 6,
    title: 'Question 6: Turning Point (Completed Square)',
    syllabusRef: 'Cambridge 0580/43/O/N/23 Q7',
    prompt: 'The equation of a curve is written in completed square form as y = (x - 3)² - 5. Write down the coordinates of the turning point.',
    equationDisplay: 'y = (x - 3)² - 5',
    type: 'multiple-choice',
    options: [
      { label: '(3, -5)', value: '(3, -5)' },
      { label: '(-3, -5)', value: '(-3, -5)' },
      { label: '(3, 5)', value: '(3, 5)' },
      { label: '(-3, 5)', value: '(-3, 5)' },
    ],
    correctAnswer: '(3, -5)',
    hint: 'For y = (x - h)² + k, the minimum turning point occurs when (x - h) = 0, giving (h, k).',
    explanation: 'Since (x - 3)² ≥ 0 for all real numbers, the minimum value occurs when x - 3 = 0 => x = 3. Substituting gives y = -5. Hence, the vertex is (3, -5). [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 7,
    title: 'Question 7: Number of Real Roots',
    syllabusRef: 'Cambridge 0580/22/M/J/23 Q16',
    prompt: 'Determine the number of real roots (points of intersection with the x-axis) for the quadratic curve y = x² + 4x + 4.',
    equationDisplay: 'y = x² + 4x + 4',
    type: 'multiple-choice',
    options: [
      { label: '1 repeated root (touches x-axis at vertex)', value: '1 root' },
      { label: '2 distinct real roots (cuts x-axis twice)', value: '2 roots' },
      { label: '0 real roots (does not intersect x-axis)', value: '0 roots' },
    ],
    correctAnswer: '1 root',
    hint: 'Calculate discriminant Δ = b² - 4ac. If Δ = 0, there is 1 repeated root.',
    explanation: 'Discriminant Δ = b² - 4ac = (4)² - 4(1)(4) = 16 - 16 = 0. Because Δ = 0, the curve has exactly 1 repeated root at x = -2, meaning the turning point touches the x-axis. [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
  {
    id: 8,
    title: 'Question 8: Identifying Curve from Landmarks',
    syllabusRef: 'Cambridge 0580/42/O/N/20 Q12',
    prompt: 'A sketched parabola opens upwards (∪-shape), cuts the x-axis at x = -1 and x = 3, and has y-intercept (0, -3). Which equation represents this curve?',
    equationDisplay: 'Roots: x = -1, x = 3 · y-intercept: (0, -3)',
    type: 'multiple-choice',
    options: [
      { label: 'y = x² - 2x - 3', value: 'y = x² - 2x - 3' },
      { label: 'y = x² + 2x - 3', value: 'y = x² + 2x - 3' },
      { label: 'y = -x² + 2x + 3', value: 'y = -x² + 2x + 3' },
      { label: 'y = x² - 4x - 3', value: 'y = x² - 4x - 3' },
    ],
    correctAnswer: 'y = x² - 2x - 3',
    hint: 'Use the factorised form: y = a(x - r₁)(x - r₂). Here r₁ = -1, r₂ = 3.',
    explanation: 'From the roots: y = (x - (-1))(x - 3) = (x + 1)(x - 3) = x² - 3x + x - 3 = x² - 2x - 3. Checking the y-intercept: when x = 0, y = -3. Matches perfectly! [1 mark]',
    marks: 1,
    userAnswer: null,
    isCorrect: null,
  },
];

export const ExerciseModule: React.FC<ExerciseModuleProps> = ({
  questions,
  onUpdateQuestion,
  onResetAll,
  onGoToSubmission,
  score,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [tempInputs, setTempInputs] = useState<Record<number, string>>({});

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const handleSelectOption = (qId: number, value: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const isCorrect = String(value).trim() === String(q.correctAnswer).trim();
    onUpdateQuestion(qId, value, isCorrect);

    if (isCorrect && score + 1 === questions.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNumericSubmit = (qId: number) => {
    const inputVal = tempInputs[qId];
    if (inputVal === undefined || inputVal.trim() === '') return;
    const numericVal = Number(inputVal);
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const isCorrect = numericVal === Number(q.correctAnswer);
    onUpdateQuestion(qId, numericVal, isCorrect);

    if (isCorrect && score + 1 === questions.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const answeredCount = questions.filter((q) => q.userAnswer !== null).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Cambridge IGCSE 0580 · Formative Assessment
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Part 4: Curved Graphs & Quadratics Graded Exercises
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Score: 1 mark for each question</span>
            <span>·</span>
            <span>Total: {questions.length} Marks</span>
          </div>
        </div>

        {/* Progress & Score Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-medium text-slate-600">Current Score:</span>
              <span className="font-mono font-bold text-lg text-slate-900 tabular-nums">
                {score} / {questions.length}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-xs text-slate-600 font-mono">
              Answered: {answeredCount}/{questions.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetAll}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>
            <button
              onClick={onGoToSubmission}
              className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-semibold flex items-center gap-1.5 px-3.5 py-1.5 rounded transition-colors shadow-xs"
            >
              <span>Submit to Teacher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Question Selector List (Single line tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {questions.map((q) => {
          const isCurrent = q.id === activeQuestionId;
          const isAnswered = q.userAnswer !== null;
          return (
            <button
              key={q.id}
              onClick={() => setActiveQuestionId(q.id)}
              className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all flex items-center gap-2 shrink-0 ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Q{q.id}</span>
              {isAnswered && (
                q.isCorrect ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">
              {activeQuestion.title}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [1 mark]
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {activeQuestion.syllabusRef}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-slate-800 text-sm font-medium leading-relaxed">
            {activeQuestion.prompt}
          </p>

          {activeQuestion.equationDisplay && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-indigo-900 font-semibold inline-block">
              {activeQuestion.equationDisplay}
            </div>
          )}
        </div>

        {/* Input Interface based on type */}
        <div className="space-y-4 pt-2">
          {activeQuestion.type === 'multiple-choice' && activeQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeQuestion.options.map((option) => {
                const isSelected = activeQuestion.userAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(activeQuestion.id, option.value)}
                    className={`text-left p-3.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? activeQuestion.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-rose-500 bg-rose-50/70 text-rose-950 font-semibold'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {activeQuestion.type === 'numeric' && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Enter numerical answer"
                value={tempInputs[activeQuestion.id] ?? (activeQuestion.userAnswer !== null ? String(activeQuestion.userAnswer) : '')}
                onChange={(e) =>
                  setTempInputs({ ...tempInputs, [activeQuestion.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNumericSubmit(activeQuestion.id);
                }}
                className="w-48 px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={() => handleNumericSubmit(activeQuestion.id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>

        {/* Feedback & Mark Scheme Explanation */}
        {activeQuestion.userAnswer !== null && (
          <div
            className={`p-4 rounded-lg border text-xs space-y-2.5 transition-all ${
              activeQuestion.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                {activeQuestion.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! +1 Mark Awarded</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect (0 / 1 Mark)</span>
                  </>
                )}
              </div>
              <span className="font-mono text-xs">
                Your Answer: {String(activeQuestion.userAnswer)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <span>Cambridge Mark Scheme & Explanation:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {activeQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons between questions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveQuestionId(Math.max(1, activeQuestionId - 1))}
            disabled={activeQuestionId === 1}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Previous Question
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {activeQuestionId} of {questions.length}
          </span>

          {activeQuestionId < questions.length ? (
            <button
              onClick={() => setActiveQuestionId(activeQuestionId + 1)}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={onGoToSubmission}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>View Report & Submit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
