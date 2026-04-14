"use client";

import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "personality", personalityalt: "personality", trivia: "trivia",
  poll: "poll", list: "list", question: "q&a", vs: "wyr",
};

// Dark cinematic gradients
const bgs = [
  "linear-gradient(145deg, #1a1a2e, #16213e)",
  "linear-gradient(145deg, #2d1b4e, #1a0a2e)",
  "linear-gradient(145deg, #0f3443, #0a1e28)",
  "linear-gradient(145deg, #2a0a0a, #1a0808)",
  "linear-gradient(145deg, #1a2a1a, #0a1a0a)",
  "linear-gradient(145deg, #2a1a0a, #1a100a)",
  "linear-gradient(145deg, #0a1a2a, #081828)",
  "linear-gradient(145deg, #1c1c1c, #2a2a2a)",
  "linear-gradient(145deg, #1a0a2a, #2a1a3a)",
  "linear-gradient(145deg, #0a2a1a, #1a3a2a)",
];

interface Quiz {
  id: number; title: string; description: string; photo: string;
  type: string; url: string; views: string; taken: string; category: string;
}

export function QuizGrid({ quizzes, columns = 4 }: { quizzes: Quiz[]; columns?: 3 | 4 }) {
  const cols = columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid ${cols} gap-4`}>
      {quizzes.map((quiz, i) => {
        const slug = quiz.url || quiz.id.toString();
        const taken = Number(quiz.taken) || 0;
        const label = typeLabels[quiz.type] || quiz.type;

        return (
          <Link key={quiz.id} href={`/${slug}`}
            className={`group game-card flex flex-col animate-rise d${Math.min((i % 4) + 1, 6)}`}>
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-[16px]" style={{ background: bgs[i % bgs.length] }}>
              {quiz.photo && quiz.photo !== "" ? (
                <img src={`/uploads/${quiz.photo}`} alt={quiz.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/10 group-hover:scale-150 group-hover:border-[var(--cyan)]/30 transition-all duration-700" />
                </div>
              )}
              {/* Type badge */}
              <span className="absolute top-3 left-3 mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/70">
                {label}
              </span>
              {/* Play button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="play-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
              {/* Taken count */}
              {taken > 0 && (
                <span className="absolute bottom-3 right-3 mono text-[9px] px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white/50">
                  {taken >= 1000 ? `${(taken / 1000).toFixed(1)}K` : taken}
                </span>
              )}
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="display text-[14px] font-bold leading-snug line-clamp-2 group-hover:text-[var(--cyan)] transition-colors"
                style={{ color: "var(--gray-900)" }}>
                {quiz.title}
              </h3>
              {quiz.description && (
                <p className="mt-1.5 text-[12px] leading-relaxed line-clamp-2" style={{ color: "var(--gray-400)" }}>
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
