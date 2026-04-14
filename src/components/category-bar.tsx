"use client";

import Link from "next/link";

const categoryEmoji: Record<string, string> = {
  personality: "✨", entertainment: "🎬", science: "🔬", technology: "💻",
  music: "🎵", history: "📜", lifestyle: "☕", sports: "⚽", movies: "🎥",
  popculture: "🌟", election2012: "🗳️", skylanders: "🎮", mlb: "⚾",
  nba: "🏀", hetalia: "🌸", "90s": "📺", vampireweekend: "🎸",
  wrestling: "💪", wwe: "🏟️", dudes: "🧔", babes: "👑", gaming: "🕹️",
  twilight: "🌙", celebrities: "⭐", "harry potter": "⚡",
};

interface Props {
  categories: { id: number; title: string; term: string }[];
}

export function CategoryBar({ categories }: Props) {
  return (
    <div className="sticky top-14 z-40 bg-white border-b overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-2.5 no-scrollbar">
          <Link href="/browse"
            className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:shadow-sm"
            style={{ background: "var(--gray-900)", color: "white", fontFamily: "var(--font-display)" }}>
            🔥 All
          </Link>
          <Link href="/browse?type=personality"
            className="shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)]"
            style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
            ✨ Personality
          </Link>
          <Link href="/browse?type=trivia"
            className="shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
            style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
            🧠 Trivia
          </Link>
          <Link href="/browse?type=poll"
            className="shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all hover:border-emerald-500 hover:text-emerald-600"
            style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
            📊 Polls
          </Link>
          {/* Divider */}
          <div className="shrink-0 w-px mx-1 self-stretch" style={{ background: "var(--gray-200)" }} />
          {/* Topic categories */}
          {categories.map((cat) => (
            <Link key={cat.id} href={`/topic/${cat.term}`}
              className="shrink-0 flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan-soft)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
              {categoryEmoji[cat.term.toLowerCase()] || "📋"} {cat.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
