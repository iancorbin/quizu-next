"use client";

import Link from "next/link";

const typeColors: Record<string, { bg: string; text: string }> = {
  personality: { bg: "var(--neon-pink-soft)", text: "#D6196E" },
  personalityalt: { bg: "var(--neon-pink-soft)", text: "#D6196E" },
  trivia: { bg: "var(--neon-cyan-soft)", text: "#008FA3" },
  poll: { bg: "#E5FFF0", text: "#0A7544" },
  list: { bg: "#FFF6E5", text: "#9A5C00" },
  question: { bg: "#FFF0E5", text: "#B34500" },
  vs: { bg: "#F0E5FF", text: "#6D28D9" },
};

const typeLabels: Record<string, string> = {
  personality: "Personality", personalityalt: "Personality", trivia: "Trivia",
  poll: "Poll", list: "List", question: "Q&A", vs: "WYR",
};

const typeEmoji: Record<string, string> = {
  personality: "✨", personalityalt: "✨", trivia: "🧠", poll: "📊",
  list: "📝", question: "❓", vs: "⚡",
};

// Color palette for cards without images — creates visual variety
const cardGradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)",
];

interface Quiz {
  id: number; title: string; description: string; photo: string;
  type: string; url: string; views: string; taken: string; category: string;
}

interface Props {
  quizzes: Quiz[];
  columns?: 3 | 4;
}

export function QuizGrid({ quizzes, columns = 4 }: Props) {
  const gridCols = columns === 3
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-5`}>
      {quizzes.map((quiz, i) => {
        const slug = quiz.url || quiz.id.toString();
        const takenNum = Number(quiz.taken) || 0;
        const color = typeColors[quiz.type] || { bg: "var(--gray-50)", text: "var(--gray-600)" };
        const label = typeLabels[quiz.type] || quiz.type;
        const emoji = typeEmoji[quiz.type] || "📋";
        const gradient = cardGradients[i % cardGradients.length];

        return (
          <Link key={quiz.id} href={`/${slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            style={{ borderColor: "var(--gray-100)" }}>

            {/* Image / gradient area */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {quiz.photo && quiz.photo !== "" ? (
                <img src={`/uploads/${quiz.photo}`} alt={quiz.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="h-full w-full flex items-center justify-center" style={{ background: gradient }}>
                  <span className="text-5xl opacity-60 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {emoji}
                  </span>
                </div>
              )}
              {/* Category badge */}
              <span className="absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
                style={{ background: color.bg, color: color.text, fontFamily: "var(--font-display)" }}>
                {label}
              </span>
              {/* Taken count */}
              {takenNum > 0 && (
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}>
                  {takenNum >= 1000 ? `${(takenNum / 1000).toFixed(1)}K` : takenNum} played
                </span>
              )}
            </div>

            {/* Text content */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--neon-cyan)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)", fontSize: "0.9rem" }}>
                {quiz.title}
              </h3>
              {quiz.description && (
                <p className="mt-1.5 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--gray-400)" }}>
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
