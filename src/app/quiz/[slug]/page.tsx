import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PersonalityPlayer } from "@/components/personality-player";
import { TriviaPlayer } from "@/components/trivia-player";
import { PollPlayer } from "@/components/poll-player";
import { ListViewer } from "@/components/list-viewer";
import { WYRPlayer } from "@/components/wyr-player";
import { QuizSidebar } from "@/components/quiz-sidebar";
import { CommentSection } from "@/components/comment-section";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let quiz = await prisma.quizMeta.findFirst({ where: { url: slug, published: "2" } });
  if (!quiz) { const id = parseInt(slug); if (!isNaN(id)) quiz = await prisma.quizMeta.findFirst({ where: { id, published: "2" } }); }
  if (!quiz) return { title: "Quiz Not Found — Quizu" };
  const typeLabel = quiz.type === "personality" || quiz.type === "personalityalt" ? "Personality Quiz" : quiz.type === "trivia" ? "Trivia" : quiz.type === "poll" ? "Poll" : "Quiz";
  return {
    title: `${quiz.title} — ${typeLabel} | Quizu`,
    description: quiz.description || `Take the "${quiz.title}" ${typeLabel.toLowerCase()} on Quizu.${Number(quiz.taken) > 0 ? ` ${Number(quiz.taken).toLocaleString()} people have taken this.` : ""}`,
    openGraph: { title: `${quiz.title} | Quizu`, description: quiz.description || `Take this ${typeLabel.toLowerCase()} on Quizu!` },
  };
}

const typeLabels: Record<string, string> = {
  personality: "Personality Quiz", personalityalt: "Personality Quiz", trivia: "Trivia",
  poll: "Poll", list: "List", question: "Q&A", vs: "Would You Rather",
};

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let quiz = await prisma.quizMeta.findFirst({ where: { url: slug, published: "2" } });
  if (!quiz) { const id = parseInt(slug); if (!isNaN(id)) quiz = await prisma.quizMeta.findFirst({ where: { id, published: "2" } }); }
  if (!quiz) notFound();

  // Increment views
  prisma.quizMeta.update({ where: { id: quiz.id }, data: { views: String(Number(quiz.views || "0") + 1) } }).catch(() => {});

  // Fetch related quizzes (same type or category)
  const related = await prisma.quizMeta.findMany({
    where: {
      published: "2",
      NOT: [{ title: "" }, { id: quiz.id }],
      OR: [
        { type: quiz.type },
        ...(quiz.category ? [{ category: quiz.category }] : []),
      ],
    },
    orderBy: { id: "desc" },
    take: 8,
    select: { id: true, title: true, url: true, type: true, taken: true, description: true, views: true, category: true, photo: true, username: true },
  });

  const quizType = quiz.type;
  let content: React.ReactNode;

  if (quizType === "personality" || quizType === "personalityalt") {
    const [questions, results] = await Promise.all([
      prisma.quizPersonalityQuestion.findMany({ where: { quizId: quiz.id }, include: { answers: true }, orderBy: { id: "asc" } }),
      prisma.quizPersonalityResult.findMany({ where: { quizId: quiz.id }, orderBy: { id: "asc" } }),
    ]);
    content = <PersonalityPlayer quizId={quiz.id} quizTitle={quiz.title} questions={questions} results={results} relatedQuizzes={related} />;
  } else if (quizType === "trivia") {
    const questions = await prisma.quizTriviaQuestion.findMany({ where: { quizId: quiz.id }, include: { answers: true }, orderBy: { id: "asc" } });
    content = <TriviaPlayer quizId={quiz.id} quizTitle={quiz.title} questions={questions} relatedQuizzes={related} />;
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
    content = <div className="text-center py-12"><p className="text-4xl mb-3">🚧</p><p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>This quiz type is not yet supported.</p></div>;
  }

  const takenNum = Number(quiz.taken) || 0;
  const viewsNum = Number(quiz.views) || 0;
  const typeLabel = typeLabels[quizType] || quizType;

  return (
    <div style={{ background: "var(--white)" }}>
      {/* Breadcrumb */}
      <div style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--gray-400)" }}>
            <Link href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/browse" className="hover:text-[var(--neon-cyan)] transition-colors">Quizzes</Link>
            <span>›</span>
            <span className="truncate max-w-[200px]" style={{ color: "var(--gray-600)" }}>{quiz.title}</span>
          </div>
          <span className={`badge badge-${quizType}`}>{typeLabel}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Main content */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--gray-500)" }}>
                  {quiz.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium" style={{ color: "var(--gray-400)" }}>
                {takenNum > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <strong style={{ color: "var(--gray-700)" }}>{takenNum.toLocaleString()}</strong> people took this
                  </span>
                )}
                {viewsNum > 0 && (
                  <span>{viewsNum.toLocaleString()} views</span>
                )}
                {quiz.category && (
                  <Link href={`/topic/${quiz.category}`} className="capitalize rounded-full border px-2.5 py-0.5 hover:border-[var(--neon-cyan)] transition-colors"
                    style={{ borderColor: "var(--gray-200)" }}>
                    {quiz.category}
                  </Link>
                )}
              </div>
              <div className="mt-4 neon-line-thin w-16" />
            </div>

            {/* Quiz content */}
            {content}

            {/* Comments */}
            <CommentSection quizId={quiz.id} initialCount={0} />
          </div>

          {/* Sidebar */}
          <QuizSidebar
            quizType={quizType}
            quizAuthor={quiz.username}
            related={related}
          />
        </div>
      </div>
    </div>
  );
}
