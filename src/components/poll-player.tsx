"use client";

import { useState } from "react";

interface Props {
  quizId: number;
  answers: { id: number; title: string; description: string; photo: string; _count: { responses: number } }[];
}

export function PollPlayer({ quizId, answers }: Props) {
  const [voted, setVoted] = useState<number | null>(null);
  const totalVotes = answers.reduce((s, a) => s + a._count.responses, 0);

  if (answers.length === 0) {
    return <div className="text-center py-12"><p className="text-4xl mb-3">📊</p><p style={{ color: "var(--gray-500)" }}>No options available.</p></div>;
  }

  return (
    <div className="space-y-3">
      {answers.map((a) => {
        const votes = a._count.responses + (voted === a.id ? 1 : 0);
        const total = totalVotes + (voted !== null ? 1 : 0);
        const pct = total > 0 ? Math.round((votes / total) * 100) : 0;

        return (
          <button key={a.id} onClick={() => voted === null && setVoted(a.id)} disabled={voted !== null}
            className="relative w-full overflow-hidden rounded-2xl border-2 px-5 py-4 text-left transition-all"
            style={{
              borderColor: voted === a.id ? "var(--neon-blue)" : "var(--gray-200)",
              background: "var(--white)",
              boxShadow: voted === a.id ? "0 0 0 3px rgba(0,212,255,0.1)" : "none",
            }}>
            {voted !== null && (
              <div className="absolute inset-0 rounded-2xl transition-all duration-500"
                style={{ width: `${pct}%`, background: voted === a.id ? "var(--neon-blue-soft)" : "var(--gray-50)" }} />
            )}
            <div className="relative flex items-center justify-between">
              <span className="font-semibold text-sm" style={{ color: "var(--gray-800)", fontFamily: "var(--font-display)" }}>
                {a.title}
              </span>
              {voted !== null && (
                <span className="text-sm font-bold tabular-nums" style={{ color: voted === a.id ? "var(--neon-blue)" : "var(--gray-400)" }}>
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}
      {voted !== null && (
        <p className="text-center text-xs font-medium pt-2" style={{ color: "var(--gray-400)" }}>
          {(totalVotes + 1).toLocaleString()} total votes
        </p>
      )}
    </div>
  );
}
