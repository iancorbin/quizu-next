import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { SortableTable } from "@/components/sortable-table";
import Link from "next/link";
import type { QuizType } from "@/lib/type-themes";
import { typeThemes } from "@/lib/type-themes";

interface Props { type: QuizType; dbType: string | string[]; page: number; }

export async function TypePage({ type, dbType, page }: Props) {
  const theme = typeThemes[type];
  const perPage = 24;
  const where = { published: "2" as const, NOT: { title: "" as const }, type: Array.isArray(dbType) ? { in: dbType } : dbType };

  const [quizzes, total, staffPicks] = await Promise.all([
    prisma.quizMeta.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.quizMeta.count({ where }),
    prisma.quizMeta.findMany({ where: { ...where, username: "quizu" }, orderBy: { id: "desc" }, take: 8 }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const basePath = `/${type === "poll" ? "polls" : type === "vs" ? "would-you-rather" : type}`;

  return (
    <div>
      {/* Compact header — no massive hero, just a clean bar */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-5 right-[20%] w-40 h-40 rounded-full blur-[70px] opacity-15" style={{ background: theme.accentColor }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{theme.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {theme.label}
              </h1>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{theme.tagline}</p>
            </div>
            <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              {total.toLocaleString()} QUIZZES
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Staff picks as sortable table */}
        {staffPicks.length > 0 && page === 1 && (
          <section className="mb-10 animate-rise d2">
            <SortableTable quizzes={staffPicks} title="Staff Picks" />
          </section>
        )}

        {/* Quiz grid */}
        <section className="animate-rise d3">
          {page === 1 && <h2 className="display text-base font-bold mb-4" style={{ color: "var(--gray-900)" }}>All {theme.label}</h2>}
          {quizzes.length === 0 ? (
            <div className="text-center py-16"><p className="display font-bold" style={{ color: "var(--gray-400)" }}>No quizzes found</p></div>
          ) : (
            <QuizGrid quizzes={quizzes} />
          )}
        </section>

        {totalPages > 1 && (
          <div className="mt-10 mb-8 flex items-center justify-center gap-3">
            {page > 1 && <Link href={`${basePath}?page=${page - 1}`} className="display rounded-xl border px-5 py-2.5 text-sm font-bold hover:border-[var(--cyan)]" style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}>Previous</Link>}
            <span className="mono text-sm" style={{ color: "var(--gray-400)" }}>{page} / {totalPages}</span>
            {page < totalPages && <Link href={`${basePath}?page=${page + 1}`} className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px" }}><span>Next</span></Link>}
          </div>
        )}
      </div>
    </div>
  );
}
