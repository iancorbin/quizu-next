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
    prisma.quizMeta.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.quizMeta.count({ where }),
    prisma.quizMeta.findMany({
      where: { ...where, username: "quizu" },
      orderBy: { id: "desc" },
      take: 5,
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const basePath = `/${type === "poll" ? "polls" : type === "vs" ? "would-you-rather" : type}`;

  return (
    <div>
      {/* Hero with personality */}
      <div className="relative overflow-hidden" style={{ background: theme.heroGradient }}>
        {/* Diagonal slash pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,${theme.patternOpacity}) 20px,
            rgba(255,255,255,${theme.patternOpacity}) 22px
          )`,
        }} />
        {/* Radial fade */}
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{
          background: "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15), transparent 60%)",
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}>
              {theme.label}
            </h1>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-white/70" style={{ fontFamily: "var(--font-display)" }}>
              {theme.tagline}
            </p>
            <p className="mt-4 text-sm sm:text-base text-white/50 max-w-lg leading-relaxed">
              {theme.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}>
                {total.toLocaleString()} quizzes
              </span>
            </div>
          </div>
        </div>
        {/* Bottom fade into white */}
        <div className="h-8" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Staff picks table */}
        {featured.length > 0 && page === 1 && (
          <section className="mb-10">
            <RichTable
              title="Staff Picks"
              subtitle="Hand-picked by our team"
              accent={type === "personality" ? "pink" : "cyan"}
              quizzes={featured}
            />
          </section>
        )}

        {/* Main grid */}
        <section>
          {page === 1 && (
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              {page === 1 ? "All " + theme.label : `Page ${page}`}
            </h2>
          )}
          {quizzes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">—</p>
              <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
                No quizzes found
              </p>
            </div>
          ) : (
            <QuizGrid quizzes={quizzes} />
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 mb-6 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={`${basePath}?page=${page - 1}`}
                className="rounded-full border px-5 py-2.5 text-sm font-bold transition-all hover:border-gray-400"
                style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
                Previous
              </Link>
            )}
            <span className="text-sm font-medium" style={{ color: "var(--gray-400)" }}>
              {page} / {totalPages.toLocaleString()}
            </span>
            {page < totalPages && (
              <Link href={`${basePath}?page=${page + 1}`}
                className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px" }}>
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
