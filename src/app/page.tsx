import { prisma } from "@/lib/prisma";
import { QuizCard } from "@/components/quiz-card";
import { QuizTable } from "@/components/quiz-table";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latest, topPersonality, topTrivia, topPolls, categories] =
    await Promise.all([
      prisma.quizMeta.findMany({
        where: { published: "2", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 8,
      }),
      prisma.quizMeta.findMany({
        where: {
          published: "2",
          type: { in: ["personality", "personalityalt"] },
          NOT: { title: "" },
        },
        orderBy: { id: "desc" },
        take: 10,
      }),
      prisma.quizMeta.findMany({
        where: { published: "2", type: "trivia", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 10,
      }),
      prisma.quizMeta.findMany({
        where: { published: "2", type: "poll", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 10,
      }),
      prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
    ]);

  return (
    <div style={{ background: "var(--white)" }}>
      {/* ─── Hero ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--neon-gradient-subtle)" }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--neon-blue)", transform: "translate(30%, -50%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--neon-pink)", transform: "translate(-30%, 50%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo-quizu.png"
              alt="Quizu"
              width={180}
              height={52}
              className="h-12 w-auto mb-6"
              priority
            />
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
            >
              Which <span className="neon-text-blue">quiz</span> will
              <br />
              define <span className="neon-text-pink">you</span>?
            </h1>
            <p
              className="mt-4 max-w-lg text-lg"
              style={{ color: "var(--gray-500)", fontFamily: "var(--font-body)" }}
            >
              Thousands of personality quizzes, trivia, polls, and more.
              Take one. Share your results. Create your own.
            </p>

            {/* Quick type nav */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                { type: "personality", label: "✨ Personality", color: "var(--neon-pink)" },
                { type: "trivia", label: "🧠 Trivia", color: "var(--neon-blue)" },
                { type: "poll", label: "📊 Polls", color: "#059669" },
                { type: "list", label: "📝 Lists", color: "#B45309" },
                { type: "vs", label: "⚡ Would You Rather", color: "#7C3AED" },
              ].map((item) => (
                <Link
                  key={item.type}
                  href={`/browse?type=${item.type}`}
                  className="rounded-full border-2 bg-white px-4 py-2 text-sm font-semibold transition-all hover:shadow-md"
                  style={{
                    borderColor: "var(--gray-200)",
                    color: "var(--gray-700)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── Latest Quizzes (Cards) ───────────────────── */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 rounded-full" style={{ background: "var(--neon-gradient)" }} />
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
              >
                Fresh off the press
              </h2>
            </div>
            <Link
              href="/browse"
              className="text-sm font-semibold transition-colors hover:text-[var(--neon-blue)]"
              style={{ color: "var(--gray-400)" }}
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* ─── Categories ───────────────────────────────── */}
        {categories.length > 0 && (
          <section className="mt-14">
            <h2
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}
            >
              Explore by topic
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.term}`}
                  className="rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] hover:shadow-sm"
                  style={{
                    borderColor: "var(--gray-200)",
                    color: "var(--gray-600)",
                    background: "var(--white)",
                  }}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Ranked Tables ────────────────────────────── */}
        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <QuizTable
            title="Top Personality Quizzes"
            subtitle="Which one are you? Find out."
            accentColor="pink"
            quizzes={topPersonality}
          />
          <QuizTable
            title="Trivia Challenges"
            subtitle="Test your knowledge"
            accentColor="blue"
            quizzes={topTrivia}
          />
        </section>

        {topPolls.length > 0 && (
          <section className="mt-8">
            <QuizTable
              title="Latest Polls"
              subtitle="Cast your vote"
              accentColor="blue"
              quizzes={topPolls}
            />
          </section>
        )}
      </div>
    </div>
  );
}
