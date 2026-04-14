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

const typeEmoji: Record<string, string> = {
  personality: "✨",
  personalityalt: "✨",
  trivia: "🧠",
  poll: "📊",
  list: "📝",
  question: "❓",
  vs: "⚡",
};

interface QuizCardProps {
  quiz: {
    id: number;
    title: string;
    description: string;
    photo: string;
    type: string;
    url: string;
    views: string;
    taken: string;
    category: string;
    username: string;
  };
  rank?: number;
}

export function QuizCard({ quiz, rank }: QuizCardProps) {
  const slug = quiz.url || quiz.id.toString();
  const typeLabel = typeLabels[quiz.type] || quiz.type;
  const emoji = typeEmoji[quiz.type] || "📋";
  const badgeClass = `badge-${quiz.type}`;
  const takenNum = Number(quiz.taken) || 0;
  const viewsNum = Number(quiz.views) || 0;

  return (
    <Link href={`/${slug}`} className="quiz-card group relative flex flex-col overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "var(--gray-100)" }}>
      {/* Rank badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
          style={{ background: rank <= 3 ? "var(--neon-gradient)" : "var(--gray-700)" }}>
          {rank}
        </div>
      )}

      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "var(--neon-gradient-subtle)" }}>
        {quiz.photo && quiz.photo !== "" ? (
          <img
            src={`/uploads/${quiz.photo}`}
            alt={quiz.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-40">
            {emoji}
          </div>
        )}

        {/* Type badge — floating */}
        <span className={`absolute top-3 right-3 ${badgeClass} rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase`}>
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--neon-blue)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)", fontSize: "0.95rem" }}>
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="mt-1.5 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--gray-400)" }}>
            {quiz.description}
          </p>
        )}

        {/* Stats bar */}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs font-medium" style={{ color: "var(--gray-400)" }}>
          {takenNum > 0 && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {takenNum.toLocaleString()}
            </span>
          )}
          {viewsNum > 0 && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {viewsNum.toLocaleString()}
            </span>
          )}
          {quiz.category && (
            <span className="ml-auto capitalize truncate max-w-[80px]">{quiz.category}</span>
          )}
        </div>
      </div>

      {/* Bottom neon accent line on hover */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300" style={{ background: "var(--neon-gradient)" }} />
    </Link>
  );
}
