"use client";

import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "personality", personalityalt: "personality", trivia: "trivia",
  poll: "poll", list: "list", question: "q&a", vs: "wyr",
};

// Distinctive gradient palette — each one is a mood
const gradients = [
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #0f3443, #34e89e33)",
  "linear-gradient(135deg, #2d1b4e, #562c7f)",
  "linear-gradient(135deg, #1c1c1c, #383838)",
  "linear-gradient(135deg, #0a1628, #1a3a5c)",
  "linear-gradient(135deg, #2a0a0a, #5c1a1a)",
  "linear-gradient(135deg, #1a2a1a, #2a4a2a)",
  "linear-gradient(135deg, #2a1a0a, #4a3a1a)",
  "linear-gradient(135deg, #0a1a2a, #1a2a4a)",
  "linear-gradient(135deg, #2a0a2a, #4a1a3a)",
];

interface Quiz {
  id: number; title: string; description: string; photo: string;
  type: string; url: string; views: string; taken: string; category: string;
}

export function QuizGrid({ quizzes, columns = 4 }: { quizzes: Quiz[]; columns?: 3 | 4 }) {
  const cols = columns === 3
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid ${cols} gap-4`}>
      {quizzes.map((quiz, i) => {
        const slug = quiz.url || quiz.id.toString();
        const taken = Number(quiz.taken) || 0;
        const label = typeLabels[quiz.type] || quiz.type;
        const bg = gradients[i % gradients.length];

        return (
          <Link key={quiz.id} href={`/${slug}`}
            className={`group card-hover flex flex-col rounded-xl overflow-hidden border animate-enter d${Math.min(i % 4 + 1, 6)}`}
            style={{ borderColor: "var(--stone-100)", background: "var(--white)" }}>

            {/* Visual header */}
            <div className="relative aspect-[16/9] overflow-hidden" style={{ background: bg }}>
              {quiz.photo && quiz.photo !== "" ? (
                <img src={`/uploads/${quiz.photo}`} alt={quiz.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                /* Abstract decoration instead of emoji */
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-150 group-hover:rotate-45" />
                  <div className="absolute w-8 h-8 rounded-full border border-white/5 transition-transform duration-700 group-hover:scale-[3]" />
                </div>
              )}
              {/* Type label */}
              <span className="absolute top-3 left-3 mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white/80">
                {label}
              </span>
              {taken > 0 && (
                <span className="absolute bottom-3 right-3 mono text-[9px] font-medium px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white/60">
                  {taken >= 1000 ? `${(taken / 1000).toFixed(1)}K` : taken}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="display text-[14px] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--cyan)]"
                style={{ color: "var(--stone-900)" }}>
                {quiz.title}
              </h3>
              {quiz.description && (
                <p className="mt-1.5 text-[12px] leading-relaxed line-clamp-2" style={{ color: "var(--stone-400)" }}>
                  {quiz.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
