import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { slug },
    include: {
      author: { select: { username: true } },
      category: true,
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: true,
        },
      },
      results: true,
    },
  });

  if (!quiz || quiz.status !== "published") notFound();

  // Increment view count (fire and forget)
  prisma.quiz
    .update({ where: { id: quiz.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        {quiz.description && (
          <p className="mt-2 text-gray-500">{quiz.description}</p>
        )}
        <div className="mt-2 flex items-center justify-center gap-3 text-sm text-gray-400">
          {quiz.category && <span>{quiz.category.name}</span>}
          <span>by {quiz.author.username}</span>
          <span>{quiz.views} views</span>
        </div>
      </div>

      <QuizPlayer
        quizId={quiz.id}
        quizTitle={quiz.title}
        questions={quiz.questions}
        results={quiz.results}
      />
    </div>
  );
}
