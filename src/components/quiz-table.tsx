"use client";

import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "Personality",
  personalityalt: "Personality",
  trivia: "Trivia",
  poll: "Poll",
  list: "List",
  question: "Q&A",
  vs: "vs",
};

interface QuizTableProps {
  title: string;
  subtitle?: string;
  accentColor?: "blue" | "pink";
  quizzes: {
    id: number;
    title: string;
    type: string;
    url: string;
    views: string;
    taken: string;
    category: string;
    username: string;
  }[];
}

export function QuizTable({ title, subtitle, accentColor = "blue", quizzes }: QuizTableProps) {
  const accent = accentColor === "pink" ? "var(--neon-pink)" : "var(--neon-blue)";
  const accentSoft = accentColor === "pink" ? "var(--neon-pink-soft)" : "var(--neon-blue-soft)";

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)", background: "var(--white)" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--gray-100)" }}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{ background: accent }} />
          <div>
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{subtitle}</p>
            )}
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: accentSoft, color: accent }}>
          {quizzes.length} quizzes
        </span>
      </div>

      {/* Table */}
      <div className="divide-y" style={{ borderColor: "var(--gray-50)" }}>
        {/* Column headers */}
        <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem] px-5 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-400)", background: "var(--gray-50)" }}>
          <span>#</span>
          <span>Quiz</span>
          <span className="text-right">Type</span>
          <span className="text-right">Taken</span>
          <span className="text-right">Views</span>
        </div>

        {quizzes.map((quiz, i) => {
          const slug = quiz.url || quiz.id.toString();
          const takenNum = Number(quiz.taken) || 0;
          const viewsNum = Number(quiz.views) || 0;
          const typeLabel = typeLabels[quiz.type] || quiz.type;
          const badgeClass = `badge-${quiz.type}`;

          return (
            <Link
              key={quiz.id}
              href={`/quiz/${slug}`}
              className="quiz-table-row grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem] items-center px-5 py-3 text-sm"
              style={{ borderColor: "var(--gray-50)" }}
            >
              <span className="font-bold text-sm" style={{ color: i < 3 ? accent : "var(--gray-300)", fontFamily: "var(--font-display)" }}>
                {i + 1}
              </span>
              <span className="font-medium truncate pr-4" style={{ color: "var(--gray-800)", fontFamily: "var(--font-display)" }}>
                {quiz.title}
              </span>
              <span className="text-right">
                <span className={`${badgeClass} inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase`}>
                  {typeLabel}
                </span>
              </span>
              <span className="text-right tabular-nums text-xs font-medium" style={{ color: "var(--gray-400)" }}>
                {takenNum > 0 ? takenNum.toLocaleString() : "—"}
              </span>
              <span className="text-right tabular-nums text-xs font-medium" style={{ color: "var(--gray-400)" }}>
                {viewsNum > 0 ? viewsNum.toLocaleString() : "—"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
