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
  const tl = quiz.type === "personality" || quiz.type === "personalityalt" ? "Personality Quiz" : quiz.type === "trivia" ? "Trivia" : quiz.type === "poll" ? "Poll" : "Quiz";
  return {
    title: `${quiz.title} — ${tl} | Quizu`,
    description: quiz.description || `Take "${quiz.title}" on Quizu.${Number(quiz.taken) > 0 ? ` ${Number(quiz.taken).toLocaleString()} people played.` : ""}`,
    openGraph: { title: `${quiz.title} | Quizu`, description: quiz.description || `Take this ${tl.toLowerCase()} on Quizu!` },
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

  prisma.quizMeta.update({ where: { id: quiz.id }, data: { views: String(Number(quiz.views || "0") + 1) } }).catch(() => {});

  const related = await prisma.quizMeta.findMany({
    where: { published: "2", NOT: [{ title: "" }, { id: quiz.id }], OR: [{ type: quiz.type }, ...(quiz.category ? [{ category: quiz.category }] : [])] },
    orderBy: { id: "desc" }, take: 8,
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
    content = <div className="text-center py-12"><p className="text-4xl mb-3">🚧</p><p className="display font-bold" style={{ color: "var(--gray-400)" }}>Not yet supported.</p></div>;
  }

  const takenNum = Number(quiz.taken) || 0;
  const viewsNum = Number(quiz.views) || 0;
  const typeLabel = typeLabels[quizType] || quizType;

  return (
    <div style={{ background: "var(--white)" }}>
      {/* Game-style header bar */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-0 right-[20%] w-48 h-48 rounded-full blur-[80px] opacity-15" style={{ background: "var(--cyan)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/browse" className="hover:text-white transition-colors">Quizzes</Link>
            <span>›</span>
            <span className="truncate max-w-[200px]" style={{ color: "rgba(255,255,255,0.6)" }}>{quiz.title}</span>
          </div>

          <div className="animate-rise max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge badge-${quizType}`}>{typeLabel}</span>
              {takenNum > 0 && (
                <span className="mono text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {takenNum.toLocaleString()} played
                </span>
              )}
              {viewsNum > 0 && (
                <span className="mono text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {viewsNum.toLocaleString()} views
                </span>
              )}
            </div>
            <h1 className="display text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="mt-3 text-base leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.4)" }}>
                {quiz.description}
              </p>
            )}

            {/* XP indicator */}
            <div className="mt-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--cyan)" }}>
                +10 pts
              </span>
              {quiz.category && (
                <Link href={`/topic/${quiz.category}`} className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {quiz.category}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="h-6" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 -mt-2">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          <div>
            {content}
            <CommentSection quizId={quiz.id} initialCount={0} />
          </div>
          <QuizSidebar quizType={quizType} quizAuthor={quiz.username} related={related} />
        </div>
      </div>
    </div>
  );
}
