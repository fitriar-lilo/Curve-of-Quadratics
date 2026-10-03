import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PointCollectionModule } from './components/PointCollectionModule';
import { AnatomyModule } from './components/AnatomyModule';
import { SketchingGuideModule } from './components/SketchingGuideModule';
import { ExerciseModule, initialQuestions } from './components/ExerciseModule';
import { SubmissionModule } from './components/SubmissionModule';
import { ExerciseQuestion, StudentProfile } from './types/math';
import { BookOpen, HelpCircle, GraduationCap, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'points' | 'anatomy' | 'sketching' | 'exercises' | 'submission'>('points');
  const [questions, setQuestions] = useState<ExerciseQuestion[]>(initialQuestions);

  const [student, setStudent] = useState<StudentProfile>({
    name: '',
    studentId: '',
    gradeClass: 'Grade 10 IGCSE',
    notes: '',
  });

  const handleUpdateQuestion = (id: number, answer: string | number, isCorrect: boolean) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userAnswer: answer, isCorrect } : q))
    );
  };

  const handleResetQuiz = () => {
    setQuestions(
      initialQuestions.map((q) => ({
        ...q,
        userAnswer: null,
        isCorrect: null,
      }))
    );
  };

  const score = useMemo(() => {
    return questions.filter((q) => q.isCorrect === true).length;
  }, [questions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar Navigation */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          score={score}
          totalQuestions={questions.length}
          studentName={student.name}
        />

        {/* Hero Syllabus Sub-header */}
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-slate-200">
                Cambridge IGCSE 0580 Mathematics
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Curved Graphs (Paper 2 & Paper 4)</span>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <span className="font-mono text-indigo-300">
                Teacher: Fitriar (Semesta School)
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-emerald-400">
                Total Assessment: 8 Marks (1 pt/question)
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Viewport */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          {activeTab === 'points' && (
            <PointCollectionModule onContinue={() => setActiveTab('anatomy')} />
          )}

          {activeTab === 'anatomy' && (
            <AnatomyModule onContinue={() => setActiveTab('sketching')} />
          )}

          {activeTab === 'sketching' && (
            <SketchingGuideModule onContinue={() => setActiveTab('exercises')} />
          )}

          {activeTab === 'exercises' && (
            <ExerciseModule
              questions={questions}
              onUpdateQuestion={handleUpdateQuestion}
              onResetAll={handleResetQuiz}
              onGoToSubmission={() => setActiveTab('submission')}
              score={score}
            />
          )}

          {activeTab === 'submission' && (
            <SubmissionModule
              questions={questions}
              score={score}
              student={student}
              setStudent={setStudent}
            />
          )}
        </main>
      </div>

      {/* Clean Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              Semesta Bilingual Boarding School
            </span>
            <span>·</span>
            <span>Mathematics Department</span>
            <span>·</span>
            <span className="font-mono">Teacher: Fitriar (fitriar@semesta.sch.id)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('points')}
              className="hover:text-slate-900 transition-colors"
            >
              1. Point Collection
            </button>
            <button
              onClick={() => setActiveTab('anatomy')}
              className="hover:text-slate-900 transition-colors"
            >
              2. Anatomy
            </button>
            <button
              onClick={() => setActiveTab('sketching')}
              className="hover:text-slate-900 transition-colors"
            >
              3. Sketching
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className="hover:text-slate-900 transition-colors"
            >
              4. Exercises
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className="hover:text-slate-900 transition-colors font-medium text-indigo-600"
            >
              5. Submission & PDF
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
