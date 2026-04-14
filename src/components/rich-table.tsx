"use client";

import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "personality", personalityalt: "personality", trivia: "trivia",
  poll: "poll", list: "list", question: "q&a", vs: "wyr",
};

interface Quiz {
  id: number; title: string; description: string; type: string; url: string;
  views: string; taken: string; category: string;
}

interface Props {
  title: string;
  subtitle?: string;
  accent?: "cyan" | "pink";
  viewAllHref?: string;
  quizzes: Quiz[];
}

export function RichTable({ title, subtitle, accent = "cyan", viewAllHref, quizzes }: Props) {
  const accentVar = accent === "pink" ? "var(--pink)" : "var(--cyan)";

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--stone-100)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--stone-100)" }}>
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-7 rounded-full" style={{ background: accentVar }} />
          <div>
            <h3 className="display text-sm font-bold" style={{ color: "var(--stone-900)" }}>{title}</h3>
            {subtitle && <p className="text-[11px] mt-0.5" style={{ color: "var(--stone-400)" }}>{subtitle}</p>}
          </div>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="mono text-[10px] font-bold tracking-wide hover:text-[var(--cyan)] transition-colors"
            style={{ color: "var(--stone-400)" }}>
            VIEW ALL
          </Link>
        )}
      </div>

      {/* Rows */}
      <div>
        {quizzes.map((quiz, i) => {
          const slug = quiz.url || quiz.id.toString();
          const taken = Number(quiz.taken) || 0;
          const label = typeLabels[quiz.type] || quiz.type;
          const isTop = i < 3;

          return (
            <Link key={quiz.id} href={`/${slug}`} className="rich-row" style={{ gridTemplateColumns: "2rem 1fr auto" }}>
              <span className="display text-sm font-black text-center" style={{ color: isTop ? accentVar : "var(--stone-300)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="display text-[13px] font-semibold truncate" style={{ color: "var(--stone-800)" }}>{quiz.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`badge badge-${quiz.type}`} style={{ fontSize: "9px", padding: "1px 6px" }}>{label}</span>
                  {taken > 0 && <span className="mono text-[10px]" style={{ color: "var(--stone-400)" }}>{taken.toLocaleString()}</span>}
                </div>
              </div>
              <span className="hidden sm:block display text-[11px] font-bold shrink-0 rounded-lg px-3 py-1.5"
                style={{ background: isTop ? "var(--stone-900)" : "var(--bone)", color: isTop ? "white" : "var(--stone-500)" }}>
                {quiz.type === "poll" ? "Vote" : "Take"} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
