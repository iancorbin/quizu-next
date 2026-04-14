"use client";

import { useState } from "react";

interface Props {
  quizId: number;
  answers: { id: number; title: string; description: string; photo: string }[];
}

export function WYRPlayer({ quizId, answers }: Props) {
  const [chosen, setChosen] = useState<number | null>(null);

  if (answers.length < 2) {
    return <div className="text-center py-12"><p className="text-4xl mb-3">⚡</p><p style={{ color: "var(--gray-500)" }}>Not enough options.</p></div>;
  }

  const [a, b] = answers;

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4">
      {[a, b].map((opt, i) => (
        <button key={opt.id} onClick={() => setChosen(opt.id)}
          className="flex-1 rounded-2xl border-2 p-8 text-center transition-all"
          style={{
            borderColor: chosen === opt.id ? "var(--neon-pink)" : "var(--gray-200)",
            background: chosen === opt.id ? "var(--neon-pink-soft)" : "var(--white)",
            boxShadow: chosen === opt.id ? "0 0 0 3px rgba(255,60,172,0.1)" : "none",
            opacity: chosen !== null && chosen !== opt.id ? 0.5 : 1,
          }}>
          {opt.photo && (
            <img src={`/uploads/${opt.photo}`} alt={opt.title}
              className="mx-auto mb-4 h-32 rounded-xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            {opt.title}
          </h3>
          {opt.description && <p className="mt-2 text-sm" style={{ color: "var(--gray-500)" }}>{opt.description}</p>}
        </button>
      ))}
      {answers.length === 2 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full text-xs font-black text-white z-10"
          style={{ background: "var(--gray-900)" }}>
          OR
        </div>
      )}
    </div>
  );
}
