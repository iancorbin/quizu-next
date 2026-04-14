"use client";

import { useState } from "react";

interface Props {
  quizId: number;
  questions: {
    id: number;
    question: string;
    photo: string;
    answers: { id: number; answer: string; resultId: number; photo: string }[];
  }[];
  results: { id: number; title: string; description: string; photo: string }[];
}

export function PersonalityPlayer({ quizId, questions, results }: Props) {
  const [current, setCurrent] = useState(0);
  const [tally, setTally] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Props["results"][0] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🤔</p>
        <p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
          This quiz has no questions yet.
        </p>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + (result ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(answerId: number, resultId: number) {
    if (selectedId !== null) return;
    setSelectedId(answerId);

    const newTally = { ...tally, [resultId]: (tally[resultId] || 0) + 1 };
    setTally(newTally);

    setTimeout(() => {
      if (current === questions.length - 1) {
        const winnerId = Object.entries(newTally).sort((a, b) => b[1] - a[1])[0]?.[0];
        setResult(results.find((r) => r.id === Number(winnerId)) || results[0] || null);
      } else {
        setCurrent((i) => i + 1);
        setSelectedId(null);
      }
    }, 400);
  }

  function restart() {
    setCurrent(0);
    setTally({});
    setResult(null);
    setSelectedId(null);
  }

  // ─── Result screen ─────────────────────────────────
  if (result) {
    return (
      <div className="text-center">
        <div
          className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4"
          style={{ background: "var(--neon-pink-soft)", color: "var(--neon-pink)" }}
        >
          Your Result
        </div>
        {result.photo && (
          <img
            src={`/uploads/${result.photo}`}
            alt={result.title}
            className="mx-auto mb-6 max-h-64 rounded-2xl shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <h3
          className="text-4xl font-black neon-text-gradient"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {result.title}
        </h3>
        {result.description && (
          <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "var(--gray-500)" }}>
            {result.description}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "var(--neon-gradient)", boxShadow: "0 4px 20px rgba(0,212,255,0.25)" }}
          >
            Take Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Question screen ───────────────────────────────
  return (
    <div>
      {/* Progress */}
      <div className="mb-1 flex items-center justify-between text-xs font-medium" style={{ color: "var(--gray-400)" }}>
        <span>Question {current + 1} of {questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full" style={{ background: "var(--gray-100)" }}>
        <div className="progress-neon h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <h2
        className="text-2xl font-bold leading-snug"
        style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
      >
        {q.question}
      </h2>
      {q.photo && (
        <img
          src={`/uploads/${q.photo}`}
          alt=""
          className="mt-4 max-h-48 rounded-xl"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}

      {/* Answer options */}
      <div className="mt-6 grid gap-3">
        {q.answers.map((a) => {
          const isSelected = selectedId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => selectAnswer(a.id, a.resultId)}
              disabled={selectedId !== null}
              className="answer-option rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium"
              style={{
                borderColor: isSelected ? "var(--neon-pink)" : "var(--gray-200)",
                background: isSelected ? "var(--neon-pink-soft)" : "var(--white)",
                color: "var(--gray-800)",
                fontFamily: "var(--font-body)",
                boxShadow: isSelected ? "0 0 0 3px rgba(255,60,172,0.1)" : "none",
              }}
            >
              {a.answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}
