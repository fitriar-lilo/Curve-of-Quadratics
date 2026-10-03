import React, { useState } from 'react';
import { ExerciseQuestion, StudentProfile } from '../types/math';
import { generateStudentPdf } from '../utils/pdfGenerator';
import { Download, Mail, Copy, Check, FileCheck, CheckCircle2, User, Award, School } from 'lucide-react';

interface SubmissionModuleProps {
  questions: ExerciseQuestion[];
  score: number;
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const SubmissionModule: React.FC<SubmissionModuleProps> = ({
  questions,
  score,
  student,
  setStudent,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const teacherEmail = 'fitriar@semesta.sch.id';
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  let gradeLetter = 'U';
  let gradeComment = 'Needs Revision';
  if (percentage >= 90) {
    gradeLetter = 'A*';
    gradeComment = 'Distinction Level';
  } else if (percentage >= 75) {
    gradeLetter = 'A';
    gradeComment = 'Excellent Mastery';
  } else if (percentage >= 60) {
    gradeLetter = 'B';
    gradeComment = 'Good Understanding';
  } else if (percentage >= 50) {
    gradeLetter = 'C';
    gradeComment = 'Satisfactory Progress';
  }

  const handleDownloadPdf = () => {
    generateStudentPdf(
      {
        ...student,
        completedAt: new Date().toLocaleString(),
      },
      questions,
      score
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const emailSubject = `[IGCSE 0580 Math Submission] Quadratic Curves - ${student.name || 'Student'} (${score}/${totalQuestions} Marks)`;

  const emailBody = `Dear Teacher Fitriar,

Please find my completed digital interactive learning submission for Cambridge IGCSE 0580 Mathematics.

TOPIC: Curved Graphs (0580)
SUBTOPIC: Sketching Quadratics (Collection of Points, Turning Points & Roots)
TEACHER: Fitriar (fitriar@semesta.sch.id)
SCHOOL: Semesta School

==============================
STUDENT PROFILE
==============================
Name: ${student.name || 'Not Provided'}
Class / Grade: ${student.gradeClass || 'Grade 10 IGCSE'}
Student ID: ${student.studentId || 'N/A'}
Date Completed: ${new Date().toLocaleString()}

==============================
ASSESSMENT RESULTS
==============================
Total Score: ${score} / ${totalQuestions} Marks (${percentage}%)
IGCSE Grade Equivalent: ${gradeLetter} (${gradeComment})

Exercise Log (1 mark each):
${questions
  .map(
    (q) =>
      `• Q${q.id} [${q.title.replace(/^Question \d+:\s*/, '')}]: ${
        q.isCorrect ? '1 / 1 (CORRECT)' : '0 / 1 (INCORRECT)'
      } | Student Answer: ${q.userAnswer !== null ? q.userAnswer : 'Unanswered'}`
  )
  .join('\n')}

==============================
STUDENT REFLECTION & NOTES
==============================
${student.notes || 'I have completed the theory exploration on curves as collections of points, verified turning points and roots, and solved the Cambridge 0580 exercises.'}

* Note: I have also generated and downloaded my official submission PDF report to attach to this email.

Best regards,
${student.name || 'Student'}`;

  const mailtoLink = `mailto:${teacherEmail}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Cambridge IGCSE 0580 · Final Assessment & Report
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Part 5: Submit Work to Teacher & Download PDF
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Teacher: Fitriar</span>
            <span>·</span>
            <span className="font-mono text-indigo-700">fitriar@semesta.sch.id</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Please fill in your student details below. You can generate an official Cambridge IGCSE 0580 Mathematics PDF submission report and email your full work directly to <strong>Teacher Fitriar</strong> at <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">fitriar@semesta.sch.id</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Student Profile Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Student Credentials</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmad Rizky Pratama"
                  value={student.name}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grade 10 Cambridge / 10-A"
                    value={student.gradeClass}
                    onChange={(e) =>
                      setStudent({ ...student, gradeClass: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID / NIS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 202610580"
                    value={student.studentId}
                    onChange={(e) =>
                      setStudent({ ...student, studentId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School / Institution
                </label>
                <input
                  type="text"
                  disabled
                  value="Semesta Bilingual Boarding School (Semesta School)"
                  className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Reflection / Note to Teacher Fitriar
                </label>
                <textarea
                  rows={3}
                  placeholder="Share what you discovered about turning points, roots, and how curves are formed as a collection of points..."
                  value={student.notes}
                  onChange={(e) => setStudent({ ...student, notes: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submission Action Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Deliverables & Teacher Transmission
            </h3>

            <div className="space-y-3">
              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF Work Report</span>
              </button>

              {downloadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>PDF successfully created and downloaded to your device!</span>
                </div>
              )}

              {/* Direct Mailto Submission */}
              <a
                href={mailtoLink}
                onClick={() => setIsSubmitted(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Submit Work to fitriar@semesta.sch.id</span>
              </a>

              {/* Copy Email Text alternative */}
              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">
                      Summary Copied to Clipboard!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Submission Summary (for Webmail / Gmail)</span>
                  </>
                )}
              </button>
            </div>

            {isSubmitted && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Email Client Opened</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Please attach the downloaded PDF file (<code className="font-mono">IGCSE_0580_Quadratics_...pdf</code>) to your email before sending it to Teacher Fitriar!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Assessment Score Summary Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Official Grade & Score Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Max: 8 Marks (1 per question)
              </span>
            </div>

            {/* Score Metric display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Total Score</div>
                <div className="text-3xl font-bold font-mono text-indigo-700 mt-1 tabular-nums">
                  {score} / {totalQuestions}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {percentage}% marks attained
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium">Cambridge Level</div>
                <div className="text-3xl font-bold font-mono text-emerald-700 mt-1">
                  {gradeLetter}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {gradeComment}
                </div>
              </div>
            </div>

            {/* Syllabus Mastery Indicators */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Competency Assessment:
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">1. Curve as Collection of Points</span>
                  <span className="font-mono font-semibold text-emerald-700">Proficient</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">2. Roots & x-Intercepts</span>
                  <span className="font-mono font-semibold text-indigo-700">
                    {questions[3]?.isCorrect ? 'Proficient' : 'Developing'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">3. Turning Point & Symmetry</span>
                  <span className="font-mono font-semibold text-indigo-700">
                    {questions[4]?.isCorrect && questions[5]?.isCorrect ? 'Proficient' : 'Developing'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">4. Sketching Strategy</span>
                  <span className="font-mono font-semibold text-indigo-700">
                    {questions[7]?.isCorrect ? 'Proficient' : 'Developing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question Breakdown preview */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Questions Status:
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-2 rounded border ${
                      q.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : q.userAnswer !== null
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Q{q.id}</div>
                    <div className="text-[10px]">
                      {q.isCorrect ? '1/1 pt' : q.userAnswer !== null ? '0/1 pt' : 'None'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
