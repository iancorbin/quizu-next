import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { QuizCard } from "@/components/quiz-card";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const quizzes = await prisma.quiz.findMany({
    where: { categoryId: category.id, status: "published" },
    include: {
      category: true,
      author: { select: { username: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {category.icon && <span className="mr-2">{category.icon}</span>}
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-1 text-gray-500">{category.description}</p>
      )}

      {quizzes.length === 0 ? (
        <p className="mt-8 text-gray-500">No quizzes in this category yet.</p>
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
