import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ type?: string }> }): Promise<Metadata> {
  const { type } = await searchParams;
  const label = type ? type.charAt(0).toUpperCase() + type.slice(1) : "All";
  return {
    title: `${label} Quizzes — Browse | Quizu`,
    description: `Browse ${label.toLowerCase()} quizzes on Quizu. Thousands of personality quizzes, trivia, polls, and more.`,
  };
}

const TYPES = [
  { value: "", label: "All", emoji: "🔥" },
  { value: "personality", label: "Personality", emoji: "✨" },
  { value: "trivia", label: "Trivia", emoji: "🧠" },
  { value: "poll", label: "Polls", emoji: "📊" },
  { value: "list", label: "Lists", emoji: "📝" },
  { value: "vs", label: "WYR", emoji: "⚡" },
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; page?: string }>;
}) {
  const { type, category, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 30;

  const where: Record<string, unknown> = { published: "2", NOT: { title: "" } };
  if (type) {
    if (type === "personality") {
      where.type = { in: ["personality", "personalityalt"] };
    } else {
      where.type = type;
    }
  }
  if (category) where.category = category;

  const [quizzes, total, categories] = await Promise.all([
    prisma.quizMeta.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.quizMeta.count({ where }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const activeType = type || "";

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const t = params.type !== undefined ? params.type : type;
    const c = params.category !== undefined ? params.category : category;
    const p = params.page;
    if (t) sp.set("type", t);
    if (c) sp.set("category", c);
    if (p) sp.set("page", p);
    const qs = sp.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "var(--gray-400)" }}>
        <Link href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</Link>
        <span>›</span>
        <span style={{ color: "var(--gray-600)" }}>Browse</span>
      </div>

      <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
        {type ? TYPES.find((t) => t.value === type)?.emoji + " " + TYPES.find((t) => t.value === type)?.label : "🔥 All Quizzes"}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--gray-400)" }}>
        {total.toLocaleString()} quizzes{category && <> in <span className="capitalize font-medium">{category}</span></>}
      </p>

      {/* Type filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const isActive = activeType === t.value;
          return (
            <Link key={t.value} href={buildUrl({ type: t.value || undefined, page: undefined })}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                borderColor: isActive ? "var(--neon-cyan)" : "var(--gray-200)",
                background: isActive ? "var(--neon-cyan-soft)" : "var(--white)",
                color: isActive ? "var(--neon-cyan)" : "var(--gray-600)",
                boxShadow: isActive ? "0 0 0 2px var(--neon-cyan-glow)" : "none",
              }}>
              {t.emoji} {t.label}
            </Link>
          );
        })}
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link href={buildUrl({ category: undefined, page: undefined })}
            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{ background: !category ? "var(--gray-900)" : "var(--gray-50)", color: !category ? "white" : "var(--gray-500)" }}>
            All Topics
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={buildUrl({ category: cat.term, page: undefined })}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all"
              style={{ background: category === cat.term ? "var(--gray-900)" : "var(--gray-50)", color: category === cat.term ? "white" : "var(--gray-500)" }}>
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {/* Results — Rich Table */}
      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🤷</p>
          <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>No quizzes found</p>
        </div>
      ) : (
        <div className="mt-8">
          <RichTable
            title={`${type ? TYPES.find((t) => t.value === type)?.label || type : "All"} Quizzes`}
            subtitle={`Page ${page} of ${totalPages}`}
            accent={type === "personality" ? "pink" : "cyan"}
            quizzes={quizzes}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })}
              className="rounded-full border px-5 py-2.5 text-sm font-bold transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
              ← Previous
            </Link>
          )}
          <span className="text-sm font-medium" style={{ color: "var(--gray-400)" }}>
            {page} / {totalPages.toLocaleString()}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })}
              className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px" }}>
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
