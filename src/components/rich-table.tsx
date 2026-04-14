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
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--warm-100)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--warm-100)" }}>
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-6 rounded-full" style={{ background: av }} />
          <div>
            <h3 className="head text-sm font-bold" style={{ color: "var(--warm-900)" }}>{title}</h3>
            {subtitle && <p className="text-[11px] mt-0.5" style={{ color: "var(--warm-400)" }}>{subtitle}</p>}
          </div>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="code text-[10px] font-bold tracking-wider hover:text-[var(--cyan)]" style={{ color: "var(--warm-400)" }}>
            VIEW ALL
          </Link>
        )}
      </div>
      <div>
        {quizzes.map((q, i) => {
          const slug = q.url || q.id.toString();
          const taken = Number(q.taken) || 0;
          const top = i < 3;
          return (
            <Link key={q.id} href={`/${slug}`} className="rich-row" style={{ gridTemplateColumns: "2rem 1fr auto" }}>
              <span className="head text-sm font-black text-center" style={{ color: top ? av : "var(--warm-300)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="head text-[13px] font-semibold truncate" style={{ color: "var(--warm-800)" }}>{q.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`badge badge-${q.type}`} style={{ fontSize: "9px", padding: "1px 6px" }}>{typeLabels[q.type] || q.type}</span>
                  {taken > 0 && <span className="code text-[10px]" style={{ color: "var(--warm-400)" }}>{taken.toLocaleString()}</span>}
                </div>
              </div>
              <span className="hidden sm:block text-[11px] font-extrabold shrink-0 rounded-lg px-3 py-1.5"
                style={{ background: top ? "var(--warm-900)" : "var(--warm-50)", color: top ? "white" : "var(--warm-500)" }}>
                {q.type === "poll" ? "Vote" : "Take"} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
