"use client";

import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "Personality", personalityalt: "Personality", trivia: "Trivia",
  poll: "Poll", list: "List", question: "Q&A", vs: "vs",
};
const typeEmoji: Record<string, string> = {
  personality: "✨", personalityalt: "✨", trivia: "🧠", poll: "📊", list: "📝", question: "❓", vs: "⚡",
};

interface Quiz {
  id: number; title: string; description: string; type: string; url: string;
  views: string; taken: string; category: string;
}

interface RichTableProps {
  title: string;
  subtitle?: string;
  accent?: "cyan" | "pink";
  viewAllHref?: string;
  quizzes: Quiz[];
}

export function RichTable({ title, subtitle, accent = "cyan", viewAllHref, quizzes }: RichTableProps) {
  const accentColor = accent === "pink" ? "var(--neon-pink)" : "var(--neon-cyan)";
  const accentSoft = accent === "pink" ? "var(--neon-pink-soft)" : "var(--neon-cyan-soft)";

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)", background: "var(--white)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--gray-100)" }}>
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 rounded-full" style={{ background: accentColor }} />
          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              {title}
            </h3>
            {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{subtitle}</p>}
          </div>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs font-bold rounded-full px-4 py-1.5 transition-all hover:shadow-sm"
            style={{ background: accentSoft, color: accentColor }}>
            View all →
          </Link>
        )}
      </div>

      {/* Rows */}
      <div>
        {quizzes.map((quiz, i) => {
          const slug = quiz.url || quiz.id.toString();
          const takenNum = Number(quiz.taken) || 0;
          const viewsNum = Number(quiz.views) || 0;
          const typeLabel = typeLabels[quiz.type] || quiz.type;
          const emoji = typeEmoji[quiz.type] || "📋";
          const isTop = i < 3;

          return (
            <Link key={quiz.id} href={`/quiz/${slug}`}
              className="rich-row"
              style={{ gridTemplateColumns: "2.5rem 1fr auto" }}>
              {/* Rank */}
              <span className="flex items-center justify-center w-9 h-9 rounded-xl text-sm font-black"
                style={{
                  fontFamily: "var(--font-display)",
                  background: isTop ? "var(--gradient-brand)" : "var(--gray-50)",
                  color: isTop ? "white" : "var(--gray-400)",
                  boxShadow: isTop ? "0 2px 8px rgba(0,229,255,0.2)" : "none",
                }}>
                {i + 1}
              </span>

              {/* Content */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)", fontSize: isTop ? "15px" : "14px" }}>
                    {quiz.title}
                  </h4>
                </div>
                {quiz.description && isTop && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--gray-400)", maxWidth: "400px" }}>{quiz.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className={`badge badge-${quiz.type}`} style={{ fontSize: "10px", padding: "1px 8px" }}>
                    {emoji} {typeLabel}
                  </span>
                  {takenNum > 0 && (
                    <span className="text-[11px] font-medium" style={{ color: "var(--gray-400)" }}>
                      {takenNum.toLocaleString()} taken
                    </span>
                  )}
                  {viewsNum > 0 && (
                    <span className="text-[11px] font-medium" style={{ color: "var(--gray-400)" }}>
                      {viewsNum.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold shrink-0 transition-all"
                style={{
                  background: isTop ? "var(--gradient-brand)" : "var(--gray-50)",
                  color: isTop ? "white" : "var(--gray-500)",
                  boxShadow: isTop ? "0 2px 10px rgba(0,229,255,0.2)" : "none",
                  fontFamily: "var(--font-display)",
                }}>
                {quiz.type === "poll" ? "Vote" : quiz.type === "list" ? "View" : "Take"} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
