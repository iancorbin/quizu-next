import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent, categories] = await Promise.all([
    prisma.quiz.findMany({
      where: { status: "published", featured: true },
      include: {
        category: true,
        author: { select: { username: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.quiz.findMany({
      where: { status: "published" },
      include: {
        category: true,
        author: { select: { username: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Discover Your True Self
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">
          Take fun personality quizzes, share your results, and create your own.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/quiz"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Browse Quizzes
          </Link>
          <Link
            href="/create"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Create a Quiz
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Featured Quizzes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Quizzes
        </h2>
        {recent.length === 0 ? (
          <p className="text-gray-500">
            No quizzes yet.{" "}
            <Link href="/create" className="text-indigo-600 hover:underline">
              Create the first one!
            </Link>
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
