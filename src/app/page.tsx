import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent, categories] = await Promise.all([
    prisma.quizMeta.findMany({
      where: { published: "2", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 8,
    }),
    prisma.quizMeta.findMany({
      where: { published: "2", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 12,
      skip: 8,
    }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Quizu
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">
          Thousands of personality quizzes, trivia, polls, and more. Discover
          yourself.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {["personality", "trivia", "poll", "list", "vs"].map((type) => (
            <Link
              key={type}
              href={`/browse?type=${type}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium capitalize text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              {type === "vs" ? "Would You Rather" : type}
            </Link>
          ))}
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
                href={`/browse?category=${cat.term}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Latest Quizzes
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* More */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">More Quizzes</h2>
          <Link
            href="/browse"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>
    </div>
  );
}
