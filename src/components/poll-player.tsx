"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  quizId: number;
  answers: {
    id: number;
    title: string;
    description: string;
    photo: string;
    _count: { responses: number };
  }[];
}

export function PollPlayer({ quizId, answers }: Props) {
  const [voted, setVoted] = useState<number | null>(null);
  const totalVotes = answers.reduce((s, a) => s + a._count.responses, 0);

  function vote(answerId: number) {
    if (voted !== null) return;
    setVoted(answerId);
  }

  if (answers.length === 0) {
    return <p className="text-center text-gray-500">No poll options.</p>;
  }

  return (
    <div className="space-y-3">
      {answers.map((a) => {
        const votes = a._count.responses + (voted === a.id ? 1 : 0);
        const total = totalVotes + (voted !== null ? 1 : 0);
        const pct = total > 0 ? Math.round((votes / total) * 100) : 0;

        return (
          <button
            key={a.id}
            onClick={() => vote(a.id)}
            disabled={voted !== null}
            className={cn(
              "relative w-full overflow-hidden rounded-xl border-2 px-4 py-3 text-left transition",
              voted === null && "border-gray-200 hover:border-green-300",
              voted === a.id && "border-green-500",
              voted !== null && voted !== a.id && "border-gray-200 opacity-80"
            )}
          >
            {voted !== null && (
              <div
                className="absolute inset-0 bg-green-50"
                style={{ width: `${pct}%` }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <span className="font-medium text-gray-900">{a.title}</span>
              {voted !== null && (
                <span className="text-sm font-semibold text-green-700">
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}
      {voted !== null && (
        <p className="text-center text-sm text-gray-400">
          {totalVotes + 1} total votes
        </p>
      )}
    </div>
  );
}
