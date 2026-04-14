import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PersonalityPlayer } from "@/components/personality-player";
import { TriviaPlayer } from "@/components/trivia-player";
import { PollPlayer } from "@/components/poll-player";
import { ListViewer } from "@/components/list-viewer";
import { WYRPlayer } from "@/components/wyr-player";
import Link from "next/link";

const typeLabels: Record<string, string> = {
  personality: "Personality", personalityalt: "Personality", trivia: "Trivia",
  poll: "Poll", list: "List", question: "Q&A", vs: "Would You Rather",
};

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let quiz = await prisma.quizMeta.findFirst({ where: { url: slug, published: "2" } });
  if (!quiz) {
    const id = parseInt(slug);
    if (!isNaN(id)) quiz = await prisma.quizMeta.findFirst({ where: { id, published: "2" } });
  }
  if (!quiz) notFound();

  prisma.quizMeta.update({ where: { id: quiz.id }, data: { views: String(Number(quiz.views || "0") + 1) } }).catch(() => {});

  const quizType = quiz.type;
  let content: React.ReactNode;

  if (quizType === "personality" || quizType === "personalityalt") {
    const [questions, results] = await Promise.all([
      prisma.quizPersonalityQuestion.findMany({ where: { quizId: quiz.id }, include: { answers: true }, orderBy: { id: "asc" } }),
      prisma.quizPersonalityResult.findMany({ where: { quizId: quiz.id }, orderBy: { id: "asc" } }),
    ]);
    content = <PersonalityPlayer quizId={quiz.id} questions={questions} results={results} />;
  } else if (quizType === "trivia") {
    const questions = await prisma.quizTriviaQuestion.findMany({ where: { quizId: quiz.id }, include: { answers: true }, orderBy: { id: "asc" } });
    content = <TriviaPlayer quizId={quiz.id} questions={questions} />;
  } else if (quizType === "poll") {
    const answers = await prisma.pollAnswer.findMany({ where: { quizId: quiz.id }, include: { _count: { select: { responses: true } } }, orderBy: { id: "asc" } });
    content = <PollPlayer quizId={quiz.id} answers={answers} />;
  } else if (quizType === "list") {
    const items = await prisma.listAnswer.findMany({ where: { quizId: quiz.id }, orderBy: { id: "asc" } });
    content = <ListViewer items={items} />;
  } else if (quizType === "vs") {
    const answers = await prisma.wouldYouRatherAnswer.findMany({ where: { quizId: quiz.id }, orderBy: { id: "asc" } });
    content = <WYRPlayer quizId={quiz.id} answers={answers} />;
  } else {
    content = (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🚧</p>
        <p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
          This quiz type ({quizType}) is not yet supported.
        </p>
      </div>
    );
  }

  const takenNum = Number(quiz.taken) || 0;
  const viewsNum = Number(quiz.views) || 0;
  const typeLabel = typeLabels[quizType] || quizType;
  const badgeClass = `badge-${quizType}`;

  return (
    <div style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 flex items-center justify-between">
          <Link href="/browse" className="text-xs font-medium flex items-center gap-1 transition-colors hover:text-[var(--neon-blue)]" style={{ color: "var(--gray-400)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to quizzes
          </Link>
          <span className={`${badgeClass} rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide`}>
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--gray-500)" }}>
              {quiz.description}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium" style={{ color: "var(--gray-400)" }}>
            {takenNum > 0 && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {takenNum.toLocaleString()} taken
              </span>
            )}
            {viewsNum > 0 && (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                {viewsNum.toLocaleString()} views
              </span>
            )}
            {quiz.category && (
              <Link href={`/browse?category=${quiz.category}`} className="capitalize hover:text-[var(--neon-blue)] transition-colors">
                {quiz.category}
              </Link>
            )}
          </div>
          {/* Decorative divider */}
          <div className="mt-6 mx-auto w-16 h-0.5 rounded-full" style={{ background: "var(--neon-gradient)" }} />
        </div>

        {/* Quiz content */}
        {content}
      </div>
    </div>
  );
}
