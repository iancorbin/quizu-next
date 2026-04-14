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
  title: string; subtitle?: string; accent?: "cyan" | "pink";
  viewAllHref?: string; quizzes: Quiz[];
}

export function RichTable({ title, subtitle, accent = "cyan", viewAllHref, quizzes }: Props) {
  const av = accent === "pink" ? "var(--pink)" : "var(--cyan)";

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--gray-100)" }}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full" style={{ background: av }} />
          <div>
            <h3 className="display text-sm font-bold" style={{ color: "var(--gray-900)" }}>{title}</h3>
            {subtitle && <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-400)" }}>{subtitle}</p>}
          </div>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="mono text-[10px] font-bold tracking-wider hover:text-[var(--cyan)]" style={{ color: "var(--gray-400)" }}>
            VIEW ALL
          </Link>
        )}
      </div>
      <div>
        {quizzes.map((q, i) => {
          const slug = q.url || q.id.toString();
          const taken = Number(q.taken) || 0;
          const rankClass = i === 0 ? "rank-gold" : i === 1 ? "rank-silver" : i === 2 ? "rank-bronze" : "rank-default";

          return (
            <Link key={q.id} href={`/${slug}`} className="rich-row" style={{ gridTemplateColumns: "2.5rem 1fr auto" }}>
              <span className={`${rankClass} display w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black`}>
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="display text-[13px] font-semibold truncate" style={{ color: "var(--gray-800)" }}>{q.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`badge badge-${q.type}`} style={{ fontSize: "9px", padding: "1px 6px" }}>{typeLabels[q.type] || q.type}</span>
                  {taken > 0 && <span className="mono text-[10px]" style={{ color: "var(--gray-400)" }}>{taken.toLocaleString()} played</span>}
                </div>
              </div>
              <span className="hidden sm:flex play-btn shrink-0" style={{ width: "32px", height: "32px", borderRadius: "10px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
