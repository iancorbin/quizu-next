"use client";

import Link from "next/link";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  personality: "personality", personalityalt: "personality", trivia: "trivia",
  poll: "poll", list: "list", question: "q&a", vs: "wyr",
};

interface Quiz {
  id: number; title: string; description: string; type: string; url: string;
  views: string; taken: string; category: string; username: string;
}

type SortKey = "title" | "type" | "taken" | "views";
type SortDir = "asc" | "desc";

export function SortableTable({ quizzes, title }: { quizzes: Quiz[]; title?: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("taken");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = [...quizzes].sort((a, b) => {
    let av: string | number, bv: string | number;
    if (sortKey === "taken") { av = Number(a.taken) || 0; bv = Number(b.taken) || 0; }
    else if (sortKey === "views") { av = Number(a.views) || 0; bv = Number(b.views) || 0; }
    else if (sortKey === "type") { av = a.type; bv = b.type; }
    else { av = a.title.toLowerCase(); bv = b.title.toLowerCase(); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const maxTaken = Math.max(...quizzes.map(q => Number(q.taken) || 0), 1);

  function SortBtn({ k, label, align }: { k: SortKey; label: string; align?: string }) {
    const active = sortKey === k;
    return (
      <button onClick={() => toggleSort(k)}
        className={`display text-[10px] font-bold tracking-wide uppercase transition-colors ${align === "right" ? "text-right" : "text-left"}`}
        style={{ color: active ? "var(--cyan)" : "var(--gray-400)" }}>
        {label} {active && (sortDir === "desc" ? "↓" : "↑")}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
      {title && (
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--gray-100)" }}>
          <div className="w-1 h-5 rounded-full" style={{ background: "var(--grad-brand)" }} />
          <h3 className="display text-sm font-bold" style={{ color: "var(--gray-900)" }}>{title}</h3>
          <span className="mono text-[10px] ml-auto" style={{ color: "var(--gray-400)" }}>{quizzes.length} quizzes</span>
        </div>
      )}

      {/* Column headers */}
      <div className="grid grid-cols-[2rem_1fr_5rem_6rem_5rem_3rem] items-center gap-2 px-5 py-2" style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
        <span className="display text-[10px] font-bold tracking-wide uppercase" style={{ color: "var(--gray-400)" }}>#</span>
        <SortBtn k="title" label="Quiz" />
        <SortBtn k="type" label="Type" />
        <SortBtn k="taken" label="Played" align="right" />
        <SortBtn k="views" label="Views" align="right" />
        <span />
      </div>

      {/* Rows */}
      <div>
        {sorted.map((q, i) => {
          const slug = q.url || q.id.toString();
          const taken = Number(q.taken) || 0;
          const views = Number(q.views) || 0;
          const popularity = taken / maxTaken;
          const isHot = popularity > 0.7;
          const rankClass = i === 0 ? "rank-gold" : i === 1 ? "rank-silver" : i === 2 ? "rank-bronze" : "rank-default";

          return (
            <Link key={q.id} href={`/${slug}`}
              className="grid grid-cols-[2rem_1fr_5rem_6rem_5rem_3rem] items-center gap-2 px-5 py-3 transition-all hover:bg-[var(--gray-50)] group"
              style={{ borderBottom: "1px solid var(--gray-100)" }}>
              {/* Rank */}
              <span className={`${rankClass} display w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black`}>
                {i + 1}
              </span>

              {/* Title + description */}
              <div className="min-w-0">
                <p className="display text-[13px] font-semibold truncate group-hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--gray-800)" }}>
                  {q.title}
                </p>
                {q.category && (
                  <span className="text-[10px] capitalize" style={{ color: "var(--gray-400)" }}>{q.category}</span>
                )}
              </div>

              {/* Type */}
              <span className={`badge badge-${q.type}`} style={{ fontSize: "9px", padding: "1px 6px" }}>
                {typeLabels[q.type] || q.type}
              </span>

              {/* Played — with mini bar */}
              <div className="text-right">
                <span className="mono text-[11px] font-medium block" style={{ color: isHot ? "var(--pink)" : "var(--gray-500)" }}>
                  {taken > 0 ? taken.toLocaleString() : "—"}
                  {isHot && " 🔥"}
                </span>
                {taken > 0 && (
                  <div className="h-1 rounded-full mt-1 ml-auto" style={{ width: "100%", background: "var(--gray-100)" }}>
                    <div className="h-full rounded-full" style={{ width: `${popularity * 100}%`, background: isHot ? "var(--pink)" : "var(--cyan)", opacity: isHot ? 1 : 0.5 }} />
                  </div>
                )}
              </div>

              {/* Views */}
              <span className="mono text-[11px] text-right" style={{ color: "var(--gray-400)" }}>
                {views > 0 ? views.toLocaleString() : "—"}
              </span>

              {/* Play */}
              <div className="flex justify-end">
                <div className="play-btn opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: "28px", height: "28px", borderRadius: "8px" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
