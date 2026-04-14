"use client";

import Link from "next/link";

const typeEmoji: Record<string, string> = {
  personality: "✨", personalityalt: "✨", trivia: "🧠", poll: "📊", list: "📝", vs: "⚡",
};
const typeLabel: Record<string, string> = {
  personality: "Personality Quiz", personalityalt: "Personality Quiz",
  trivia: "Trivia", poll: "Poll", list: "List", vs: "Would You Rather",
};

interface Props {
  quiz: {
    id: number; title: string; description: string; type: string;
    url: string; taken: string; views: string;
  };
}

export function FeaturedHero({ quiz }: Props) {
  const slug = quiz.url || quiz.id.toString();
  const emoji = typeEmoji[quiz.type] || "📋";
  const label = typeLabel[quiz.type] || quiz.type;
  const takenNum = Number(quiz.taken) || 0;

  return (
    <Link href={`/${slug}`} className="block group">
      <div className="relative overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}>
                ⭐ FEATURED
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white/80"
                style={{ fontFamily: "var(--font-display)" }}>
                {emoji} {label}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight group-hover:underline decoration-2 underline-offset-4"
              style={{ fontFamily: "var(--font-display)" }}>
              {quiz.title}
            </h2>
            {quiz.description && (
              <p className="mt-3 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
                {quiz.description}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold shadow-lg transition-transform group-hover:scale-105"
                style={{ color: "var(--gray-900)", fontFamily: "var(--font-display)" }}>
                Take Quiz →
              </span>
              {takenNum > 0 && (
                <span className="text-sm font-medium text-white/50">
                  {takenNum.toLocaleString()} people took this
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
