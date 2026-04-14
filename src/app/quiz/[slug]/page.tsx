import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PersonalityPlayer } from "@/components/personality-player";
import { TriviaPlayer } from "@/components/trivia-player";
import { PollPlayer } from "@/components/poll-player";
import { ListViewer } from "@/components/list-viewer";
import { WYRPlayer } from "@/components/wyr-player";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try to find by url field first, then by id
  let quiz = await prisma.quizMeta.findFirst({
    where: { url: slug, published: "2" },
  });
  if (!quiz) {
    const id = parseInt(slug);
    if (!isNaN(id)) {
      quiz = await prisma.quizMeta.findFirst({
        where: { id, published: "2" },
      });
    }
  }
  if (!quiz) notFound();

  // Increment views
  prisma.quizMeta
    .update({
      where: { id: quiz.id },
      data: { views: String(Number(quiz.views || "0") + 1) },
    })
    .catch(() => {});

  const quizType = quiz.type;

  // Load type-specific data
  let content: React.ReactNode;

  if (quizType === "personality" || quizType === "personalityalt") {
    const [questions, results] = await Promise.all([
      prisma.quizPersonalityQuestion.findMany({
        where: { quizId: quiz.id },
        include: { answers: true },
        orderBy: { id: "asc" },
      }),
      prisma.quizPersonalityResult.findMany({
        where: { quizId: quiz.id },
        orderBy: { id: "asc" },
      }),
    ]);
    content = (
      <PersonalityPlayer
        quizId={quiz.id}
        questions={questions}
        results={results}
      />
    );
  } else if (quizType === "trivia") {
    const questions = await prisma.quizTriviaQuestion.findMany({
      where: { quizId: quiz.id },
      include: { answers: true },
      orderBy: { id: "asc" },
    });
    content = <TriviaPlayer quizId={quiz.id} questions={questions} />;
  } else if (quizType === "poll") {
    const answers = await prisma.pollAnswer.findMany({
      where: { quizId: quiz.id },
      include: { _count: { select: { responses: true } } },
      orderBy: { id: "asc" },
    });
    content = <PollPlayer quizId={quiz.id} answers={answers} />;
  } else if (quizType === "list") {
    const items = await prisma.listAnswer.findMany({
      where: { quizId: quiz.id },
      orderBy: { id: "asc" },
    });
    content = <ListViewer items={items} />;
  } else if (quizType === "vs") {
    const answers = await prisma.wouldYouRatherAnswer.findMany({
      where: { quizId: quiz.id },
      orderBy: { id: "asc" },
    });
    content = <WYRPlayer quizId={quiz.id} answers={answers} />;
  } else {
    content = (
      <p className="text-gray-500 text-center">
        This quiz type ({quizType}) is not yet supported.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        {quiz.description && (
          <p className="mt-2 text-gray-500">{quiz.description}</p>
        )}
        <div className="mt-2 flex items-center justify-center gap-3 text-sm text-gray-400">
          <span className="capitalize rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {quizType === "vs"
              ? "Would You Rather"
              : quizType === "personalityalt"
                ? "Personality"
                : quizType}
          </span>
          {quiz.taken && quiz.taken !== "0" && quiz.taken !== "" && (
            <span>{Number(quiz.taken).toLocaleString()} taken</span>
          )}
          {quiz.views && quiz.views !== "0" && quiz.views !== "" && (
            <span>{Number(quiz.views).toLocaleString()} views</span>
          )}
        </div>
      </div>

      {content}
    </div>
  );
}
