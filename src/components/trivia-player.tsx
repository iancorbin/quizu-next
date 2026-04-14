"use client";

import { useState } from "react";

interface Props {
  quizId: number;
  questions: {
    id: number;
    question: string;
    photo: string;
    answers: { id: number; answer: string; correct: string; photo: string }[];
  }[];
}

export function TriviaPlayer({ quizId, questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🧠</p>
        <p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>No questions available.</p>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + (finished ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(answerId: number, isCorrect: boolean) {
    if (selected !== null) return;
    setSelected(answerId);
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (current === questions.length - 1) {
        setFinished(true);
      } else {
        setCurrent((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
  }

  function restart() {
    setCurrent(0); setScore(0); setSelected(null); setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center">
        <div className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4"
          style={{ background: "var(--neon-blue-soft)", color: "var(--neon-blue)" }}>
          Final Score
        </div>
        <div className="text-7xl font-black neon-text-gradient" style={{ fontFamily: "var(--font-display)" }}>
          {score}/{questions.length}
        </div>
        <p className="mt-2 text-lg" style={{ color: "var(--gray-500)" }}>{pct}% correct</p>
        <button onClick={restart}
          className="mt-8 rounded-full px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
          style={{ background: "var(--neon-gradient)" }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium" style={{ color: "var(--gray-400)" }}>
        <span>Question {current + 1} of {questions.length}</span>
        <span className="font-bold" style={{ color: "var(--neon-blue)" }}>Score: {score}</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full" style={{ background: "var(--gray-100)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "var(--neon-blue)", boxShadow: "0 0 12px rgba(0,212,255,0.3)" }} />
      </div>

      <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
        {q.question}
      </h2>
      {q.photo && <img src={`/uploads/${q.photo}`} alt="" className="mt-4 max-h-48 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}

      <div className="mt-6 grid gap-3">
        {q.answers.map((a) => {
          const isCorrect = a.correct === "A" || a.correct === "1";
          const isSelected = selected === a.id;
          const showResult = selected !== null;
          let borderColor = "var(--gray-200)";
          let bg = "var(--white)";
          if (showResult && isSelected && isCorrect) { borderColor = "#059669"; bg = "#E8FFF0"; }
          if (showResult && isSelected && !isCorrect) { borderColor = "#DC2626"; bg = "#FFF0F0"; }
          if (showResult && !isSelected && isCorrect) { borderColor = "#059669"; bg = "#E8FFF0"; }

          return (
            <button key={a.id} onClick={() => selectAnswer(a.id, isCorrect)} disabled={selected !== null}
              className="answer-option rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all"
              style={{ borderColor, background: bg, color: "var(--gray-800)", opacity: showResult && !isSelected && !isCorrect ? 0.4 : 1 }}>
              <span className="flex items-center justify-between">
                {a.answer}
                {showResult && isSelected && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                {showResult && !isSelected && isCorrect && <span className="text-green-600 text-xs">Correct</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
