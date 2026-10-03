import React from 'react';
import { Award, FileText, Send } from 'lucide-react';

interface HeaderProps {
  activeTab: 'points' | 'anatomy' | 'sketching' | 'exercises' | 'submission';
  setActiveTab: (tab: 'points' | 'anatomy' | 'sketching' | 'exercises' | 'submission') => void;
  score: number;
  totalQuestions: number;
  studentName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  score,
  totalQuestions,
  studentName,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('points')}
            className="text-left font-bold text-lg tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
          >
            IGCSE 0580 Curved Graphs
          </button>
          <span className="hidden lg:inline text-xs text-slate-400 font-normal">
            Semesta School · Teacher Fitriar
          </span>
        </div>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('points')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'points'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Collection of Points
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'anatomy'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Roots & Turning Points
          </button>

          <button
            onClick={() => setActiveTab('sketching')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'sketching'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Sketching Guide
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'exercises'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>4. Exercises</span>
            <span className="font-mono text-xs tabular-nums text-slate-500">
              ({score}/{totalQuestions})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'submission'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Submit & PDF
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions / status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-mono">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Score:</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {score}/{totalQuestions}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('submission')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Work</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveTab('points')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'points' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          1. Points
        </button>
        <button
          onClick={() => setActiveTab('anatomy')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'anatomy' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          2. Anatomy
        </button>
        <button
          onClick={() => setActiveTab('sketching')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'sketching' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          3. Sketching
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'exercises' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          4. Exercises ({score}/{totalQuestions})
        </button>
        <button
          onClick={() => setActiveTab('submission')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'submission' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600'
          }`}
        >
          5. Submit
        </button>
      </div>
    </header>
  );
};
