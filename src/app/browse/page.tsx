import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "", label: "All" },
  { value: "personality", label: "Personality" },
  { value: "personalityalt", label: "Personality (Alt)" },
  { value: "trivia", label: "Trivia" },
  { value: "poll", label: "Poll" },
  { value: "list", label: "List" },
  { value: "vs", label: "Would You Rather" },
  { value: "question", label: "Question" },
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; page?: string }>;
}) {
  const { type, category, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 24;

  const where: Record<string, unknown> = {
    published: "2",
    NOT: { title: "" },
  };
  if (type) where.type = type;
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
    if (params.type || type) sp.set("type", params.type ?? type ?? "");
    if (params.category || category)
      sp.set("category", params.category ?? category ?? "");
    if (params.page) sp.set("page", params.page);
    // Clean empty params
    for (const [k, v] of sp.entries()) {
      if (!v) sp.delete(k);
    }
    const qs = sp.toString();
    return `/browse${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Browse Quizzes
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({total.toLocaleString()} results)
        </span>
      </h1>

      {/* Type filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Link
            key={t.value}
            href={buildUrl({ type: t.value || undefined, page: undefined })}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              (type || "") === t.value
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildUrl({ category: undefined, page: undefined })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              !category
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.term, page: undefined })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                category === cat.term
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {/* Results */}
      {quizzes.length === 0 ? (
        <p className="mt-8 text-gray-500">No quizzes found.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
