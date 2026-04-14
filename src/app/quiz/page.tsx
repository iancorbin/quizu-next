import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BrowseQuizzesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [quizzes, categories] = await Promise.all([
    prisma.quiz.findMany({
      where: {
        status: "published",
        ...(category ? { category: { slug: category } } : {}),
      },
      include: {
        category: true,
        author: { select: { username: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Browse Quizzes</h1>

      {/* Category filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/quiz"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            !category
              ? "border-indigo-600 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/quiz?category=${cat.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              category === cat.slug
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Quiz grid */}
      {quizzes.length === 0 ? (
        <p className="mt-8 text-gray-500">No quizzes found in this category.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
