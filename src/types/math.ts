export interface Point {
  x: number;
  y: number;
}

export interface QuadraticCoeffs {
  a: number;
  b: number;
  c: number;
}

export interface ExerciseQuestion {
  id: number;
  title: string;
  syllabusRef: string;
  prompt: string;
  equationDisplay?: string;
  type: 'multiple-choice' | 'numeric' | 'coordinate' | 'select-shape';
  options?: { label: string; value: string }[];
  correctAnswer: string | number | { x: number; y: number };
  unit?: string;
  hint: string;
  explanation: string;
  userAnswer?: string | number | { x: number; y: number } | null;
  isCorrect?: boolean | null;
  marks: 1;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  gradeClass: string;
  notes: string;
  completedAt?: string;
}

export interface EvaluationResult {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  submitted: boolean;
}
