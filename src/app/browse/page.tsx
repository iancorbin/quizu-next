import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import { QuizTable } from "@/components/quiz-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "", label: "All", emoji: "🔥" },
  { value: "personality", label: "Personality", emoji: "✨" },
  { value: "personalityalt", label: "Personality (Alt)", emoji: "✨" },
  { value: "trivia", label: "Trivia", emoji: "🧠" },
  { value: "poll", label: "Polls", emoji: "📊" },
  { value: "list", label: "Lists", emoji: "📝" },
  { value: "vs", label: "Would You Rather", emoji: "⚡" },
  { value: "question", label: "Q&A", emoji: "❓" },
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    category?: string;
    page?: string;
    view?: string;
  }>;
}) {
  const { type, category, page: pageStr, view } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = view === "table" ? 50 : 24;

  const where: Record<string, unknown> = {
    published: "2",
    NOT: { title: "" },
  };
  if (type) {
    if (type === "personality") {
      where.type = { in: ["personality", "personalityalt"] };
    } else {
      where.type = type;
    }
  }
  if (category) where.category = category;

  const [quizzes, total, categories] = await Promise.all([
    prisma.quizMeta.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.quizMeta.count({ where }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const t = params.type !== undefined ? params.type : type;
    const c = params.category !== undefined ? params.category : category;
    const v = params.view !== undefined ? params.view : view;
    const p = params.page;
    if (t) sp.set("type", t);
    if (c) sp.set("category", c);
    if (v) sp.set("view", v);
    if (p) sp.set("page", p);
    const qs = sp.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  const activeType = type || "";
  const isTableView = view === "table";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
          >
            {type
              ? TYPES.find((t) => t.value === type)?.emoji + " " + (TYPES.find((t) => t.value === type)?.label || type)
              : "🔥 All Quizzes"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--gray-400)" }}>
            {total.toLocaleString()} quizzes
            {category && <> in <span className="capitalize font-medium">{category}</span></>}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "var(--gray-200)" }}>
          <Link
            href={buildUrl({ view: undefined })}
            className="px-3 py-1.5 text-xs font-semibold"
            style={{
              background: !isTableView ? "var(--gray-900)" : "var(--white)",
              color: !isTableView ? "var(--white)" : "var(--gray-500)",
            }}
          >
            Cards
          </Link>
          <Link
            href={buildUrl({ view: "table" })}
            className="px-3 py-1.5 text-xs font-semibold"
            style={{
              background: isTableView ? "var(--gray-900)" : "var(--white)",
              color: isTableView ? "var(--white)" : "var(--gray-500)",
            }}
          >
            Table
          </Link>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPES.filter((t) => t.value !== "personalityalt").map((t) => {
          const isActive = activeType === t.value || (activeType === "personality" && t.value === "personality");
          return (
            <Link
              key={t.value}
              href={buildUrl({ type: t.value || undefined, page: undefined })}
              className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all"
              style={{
                borderColor: isActive ? "var(--neon-blue)" : "var(--gray-200)",
                background: isActive ? "var(--neon-blue-soft)" : "var(--white)",
                color: isActive ? "var(--neon-blue)" : "var(--gray-600)",
                boxShadow: isActive ? "0 0 0 1px rgba(0,212,255,0.2)" : "none",
              }}
            >
              {t.emoji} {t.label}
            </Link>
          );
        })}
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          <Link
            href={buildUrl({ category: undefined, page: undefined })}
            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{
              background: !category ? "var(--gray-900)" : "var(--gray-50)",
              color: !category ? "var(--white)" : "var(--gray-500)",
            }}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.term, page: undefined })}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all"
              style={{
                background: category === cat.term ? "var(--gray-900)" : "var(--gray-50)",
                color: category === cat.term ? "var(--white)" : "var(--gray-500)",
              }}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {/* Results */}
      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🤷</p>
          <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
            No quizzes found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--gray-400)" }}>
            Try a different filter
          </p>
        </div>
      ) : isTableView ? (
        <QuizTable
          title={type ? `${TYPES.find((t) => t.value === type)?.label || type} Quizzes` : "All Quizzes"}
          accentColor={type === "personality" || type === "personalityalt" ? "pink" : "blue"}
          quizzes={quizzes}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} rank={(page - 1) * perPage + i + 1} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-full border px-5 py-2 text-sm font-semibold transition-all hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
            >
              ← Previous
            </Link>
          )}
          <span className="text-sm font-medium" style={{ color: "var(--gray-400)" }}>
            Page {page} of {totalPages.toLocaleString()}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-full border px-5 py-2 text-sm font-semibold transition-all hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
