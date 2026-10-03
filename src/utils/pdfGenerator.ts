import { jsPDF } from 'jspdf';
import { ExerciseQuestion, StudentProfile } from '../types/math';

export const generateStudentPdf = (
  student: StudentProfile,
  questions: ExerciseQuestion[],
  score: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('SEMESTA SCHOOL — MATHEMATICS DEPARTMENT', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    'Cambridge IGCSE 0580 · Topic: Curved Graphs · Subtopic: Sketching Quadratics',
    margin + 6,
    y + 14
  );
  doc.text(
    'Teacher: Fitriar  |  Email: fitriar@semesta.sch.id',
    margin + 6,
    y + 18.5
  );

  y += 28;

  // Student Profile Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.text(`Student Name: ${student.name || 'Not Provided'}`, margin + 5, y + 7);
  doc.text(`Class / Grade: ${student.gradeClass || 'IGCSE Grade 10'}`, margin + 5, y + 13);
  doc.text(`Student ID: ${student.studentId || 'N/A'}`, margin + 5, y + 19);

  const dateStr = student.completedAt || new Date().toLocaleString();
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${dateStr}`, margin + 100, y + 7);

  // Score Box
  const percentage = Math.round((score / questions.length) * 100);
  let grade = 'U';
  if (percentage >= 90) grade = 'A* (Outstanding)';
  else if (percentage >= 75) grade = 'A (Excellent)';
  else if (percentage >= 60) grade = 'B (Good)';
  else if (percentage >= 50) grade = 'C (Satisfactory)';
  else grade = 'Needs Practice';

  doc.setFont('helvetica', 'bold');
  doc.text(`Score: ${score} / ${questions.length} Marks (${percentage}%)`, margin + 100, y + 13);
  doc.text(`IGCSE Level: ${grade}`, margin + 100, y + 19);

  y += 30;

  // Title for Question Log
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('EXAMINATION EXERCISE LOG (Score 1 for each question):', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Q#', margin + 3, y + 4.8);
  doc.text('Topic & Question Focus', margin + 14, y + 4.8);
  doc.text('Student Answer', margin + 85, y + 4.8);
  doc.text('Correct Answer', margin + 125, y + 4.8);
  doc.text('Mark', margin + 160, y + 4.8);

  y += 7;

  // Table rows
  questions.forEach((q) => {
    // Check if new page needed
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    const rowHeight = 15;
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Q${q.id}`, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const titleSnippet = doc.splitTextToSize(q.title.replace(/^Question \d+:\s*/, ''), 68);
    doc.text(titleSnippet, margin + 14, y + 5);

    const studentAnsStr = q.userAnswer !== null ? String(q.userAnswer) : 'Not Answered';
    doc.setTextColor(q.isCorrect ? 22 : 220, q.isCorrect ? 101 : 38, q.isCorrect ? 52 : 38);
    doc.text(studentAnsStr.substring(0, 22), margin + 85, y + 5);

    doc.setTextColor(51, 65, 85);
    doc.text(String(q.correctAnswer).substring(0, 22), margin + 125, y + 5);

    // Mark
    doc.setFont('helvetica', 'bold');
    if (q.isCorrect) {
      doc.setTextColor(22, 101, 52);
      doc.text('1 / 1', margin + 160, y + 5);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text('0 / 1', margin + 160, y + 5);
    }

    // Explanation snippet on second line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const explanationSnippet = doc.splitTextToSize(`Key: ${q.explanation}`, contentWidth - 14);
    doc.text(explanationSnippet, margin + 14, y + 10.5);

    y += rowHeight;
  });

  y += 6;

  // Student Reflection / Remarks
  if (y > pageHeight - 45) {
    doc.addPage();
    y = margin;
  }

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Student Self-Reflection & Remarks:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const noteLines = doc.splitTextToSize(
    student.notes ||
      'I completed the interactive exploration on curves as a collection of points, investigated turning points & roots, and verified my sketching technique.',
    contentWidth - 8
  );
  doc.text(noteLines, margin + 4, y + 12);

  y += 28;

  // Teacher Sign-off
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Teacher Verification: Fitriar, M.Pd. (fitriar@semesta.sch.id)', margin, y + 4);
  doc.text('Semesta School Cambridge IGCSE 0580 Mathematics Verification', margin, y + 8);

  const cleanName = (student.name || 'student').toLowerCase().replace(/\s+/g, '_');
  doc.save(`IGCSE_0580_Quadratics_${cleanName}.pdf`);
};
