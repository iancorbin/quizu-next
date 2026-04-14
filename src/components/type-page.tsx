import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { QuizType } from "@/lib/type-themes";
import { typeThemes } from "@/lib/type-themes";

interface Props {
  type: QuizType;
  dbType: string | string[];
  page: number;
}

export async function TypePage({ type, dbType, page }: Props) {
  const theme = typeThemes[type];
  const perPage = 24;

  const where = {
    published: "2" as const,
    NOT: { title: "" as const },
    type: Array.isArray(dbType) ? { in: dbType } : dbType,
  };

  const [quizzes, total, featured] = await Promise.all([
    prisma.quizMeta.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.quizMeta.count({ where }),
    prisma.quizMeta.findMany({ where: { ...where, username: "quizu" }, orderBy: { id: "desc" }, take: 5 }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const basePath = `/${type === "poll" ? "polls" : type === "vs" ? "would-you-rather" : type}`;

  return (
    <div>
      {/* Game-style hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Accent orb matching type color */}
        <div className="absolute top-10 right-[20%] w-64 h-64 rounded-full blur-[100px] opacity-20 float" style={{ background: theme.accentColor }} />
        <div className="absolute bottom-0 left-[10%] w-48 h-48 rounded-full blur-[80px] opacity-10" style={{ background: theme.accentColor }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-5"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              <div className="w-2 h-2 rounded-full glow" style={{ background: theme.accentColor }} />
              <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                {total.toLocaleString()} QUIZZES
              </span>
            </div>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
              {theme.label}
            </h1>
            <p className="display mt-2 text-xl font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {theme.tagline}
            </p>
            <p className="mt-4 text-sm max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
              {theme.description}
            </p>

            {/* Mini XP bar for this type */}
            <div className="mt-6 max-w-xs">
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${Math.min(100, Math.round((total / 300) * 100))}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-6" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2">
        {/* Staff picks */}
        {featured.length > 0 && page === 1 && (
          <section className="mb-10 animate-rise d2">
            <RichTable title="Staff Picks" subtitle="Hand-picked by our team"
              accent={type === "personality" ? "pink" : "cyan"} quizzes={featured} />
          </section>
        )}

        {/* Grid */}
        <section className="animate-rise d3">
          {page === 1 && (
            <h2 className="display text-lg font-bold mb-5" style={{ color: "var(--gray-900)" }}>
              All {theme.label}
            </h2>
          )}
          {quizzes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🎮</p>
              <p className="display font-bold" style={{ color: "var(--gray-400)" }}>No quizzes found</p>
            </div>
          ) : (
            <QuizGrid quizzes={quizzes} />
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 mb-8 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={`${basePath}?page=${page - 1}`}
                className="display rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:border-[var(--cyan)]"
                style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}>
                Previous
              </Link>
            )}
            <span className="mono text-sm font-medium" style={{ color: "var(--gray-400)" }}>
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`${basePath}?page=${page + 1}`} className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px" }}>
                <span>Next</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
