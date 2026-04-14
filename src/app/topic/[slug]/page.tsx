import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RichTable } from "@/components/rich-table";
import { QuizGrid } from "@/components/quiz-grid";
import Link from "next/link";
import type { Metadata } from "next";

const topicContent: Record<string, { intro: string; facts: string[] }> = {
  personality: { intro: "Personality quizzes reveal hidden aspects of who you are — and they're incredibly fun to share.", facts: ["Over 50% of people share their personality quiz results on social media", "The MBTI is the world's most popular personality assessment", "Personality quizzes have been internet culture staples since the 2000s"] },
  entertainment: { intro: "Think you know movies, TV, and pop culture? Put your knowledge to the test.", facts: ["The average person watches over 4 hours of TV per day", "Marvel has released over 30 films in the MCU", "Streaming services produce more original content than traditional networks"] },
  science: { intro: "From 8th grade basics to PhD-level challenges. How much do you really know?", facts: ["Only 28% of American adults are scientifically literate", "A day on Venus is longer than a year on Venus", "The human body has enough carbon to fill 9,000 pencils"] },
  technology: { intro: "From the birth of the internet to AI — how well do you understand tech?", facts: ["The first website went live on August 6, 1991", "There are over 700 programming languages", "The average person checks their phone 144 times per day"] },
  music: { intro: "From lyrics to legends. How deep does your music knowledge go?", facts: ["Music activates more brain regions than any other activity", "The most-streamed Spotify song has over 4 billion plays", "Music can improve workout performance by up to 15%"] },
  history: { intro: "Those who don't know history are doomed to fail these quizzes.", facts: ["Cleopatra lived closer to the moon landing than the pyramids", "Oxford University is older than the Aztec Empire", "The shortest war lasted 38 minutes"] },
  lifestyle: { intro: "Food, travel, coffee — the choices that define your daily life.", facts: ["Coffee is the world's second most traded commodity", "The average person makes 35,000 decisions per day", "Travel is rated a top contributor to happiness"] },
  sports: { intro: "From the Super Bowl to the World Cup. How deep is your sports IQ?", facts: ["The Olympics have been held every 4 years since 1896", "A golf ball has 336 dimples", "The FIFA World Cup is the most-watched sporting event"] },
  movies: { intro: "From 90s classics to modern blockbusters — how well do you know cinema?", facts: ["The first movie was made in 1888", "Avatar held the box office record for over 10 years", "The average Hollywood movie costs $65M to produce"] },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findFirst({ where: { term: slug } });
  if (!cat) return { title: "Topic Not Found" };
  const intro = topicContent[slug]?.intro || `Explore ${cat.title.toLowerCase()} quizzes on Quizu.`;
  return {
    title: `${cat.title} Quizzes — Free ${cat.title} Quizzes Online | Quizu`,
    description: intro.slice(0, 155),
    openGraph: { title: `${cat.title} Quizzes — Quizu`, description: intro },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { term: slug } });
  if (!category) notFound();

  const [quizzes, allCategories, quizCount] = await Promise.all([
    prisma.quizMeta.findMany({ where: { published: "2", category: category.term, NOT: { title: "" } }, orderBy: { id: "desc" }, take: 50 }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
    prisma.quizMeta.count({ where: { published: "2", category: category.term, NOT: { title: "" } } }),
  ]);

  // Filter to cats with content
  const liveCats: typeof allCategories = [];
  for (const c of allCategories) {
    const n = await prisma.quizMeta.count({ where: { category: c.term, published: "2", NOT: { title: "" } } });
    if (n > 0) liveCats.push(c);
  }

  const tc = topicContent[slug];
  const topQuizzes = quizzes.slice(0, 5);
  const restQuizzes = quizzes.slice(5);

  return (
    <div>
      {/* Game-style hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 right-[25%] w-56 h-56 rounded-full blur-[90px] opacity-20 float" style={{ background: "var(--cyan)" }} />
        <div className="absolute bottom-0 left-[15%] w-40 h-40 rounded-full blur-[70px] opacity-10" style={{ background: "var(--pink)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/browse" className="hover:text-white transition-colors">Quizzes</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{category.title}</span>
          </div>

          <div className="animate-rise max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-5"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              <div className="w-2 h-2 rounded-full glow" style={{ background: "var(--cyan)" }} />
              <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                {quizCount} QUIZZES
              </span>
            </div>

            <h1 className="display text-4xl sm:text-5xl font-extrabold text-white leading-[1.05] tracking-tight">
              {category.title} <span className="text-gradient-vivid">Quizzes</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
              {tc?.intro || `Explore the best ${category.title.toLowerCase()} quizzes on Quizu.`}
            </p>

            <div className="mt-5 max-w-xs">
              <div className="xp-bar"><div className="xp-fill" style={{ width: `${Math.min(100, quizCount * 10)}%` }} /></div>
            </div>
          </div>
        </div>
        <div className="h-6" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2">
        {/* Fun facts */}
        {tc?.facts && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10 animate-rise d2">
            {tc.facts.map((fact, i) => (
              <div key={i} className="game-card p-5">
                <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "var(--cyan)" }}>
                  FACT #{i + 1}
                </span>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--gray-600)" }}>{fact}</p>
              </div>
            ))}
          </div>
        )}

        {/* Topic pills */}
        <div className="flex flex-wrap gap-2 mb-8 animate-rise d3">
          {liveCats.map(cat => (
            <Link key={cat.id} href={`/topic/${cat.term}`}
              className="display rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all hover:border-[var(--cyan)]"
              style={{
                borderColor: cat.term === slug ? "var(--cyan)" : "var(--gray-200)",
                background: cat.term === slug ? "var(--cyan-10)" : "var(--white)",
                color: cat.term === slug ? "var(--cyan)" : "var(--gray-500)",
              }}>
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Top ranked */}
        {topQuizzes.length > 0 && (
          <section className="mb-10 animate-rise d4">
            <RichTable title={`Top ${category.title}`} subtitle="Most played" accent="cyan" quizzes={topQuizzes} />
          </section>
        )}

        {/* All quizzes grid */}
        {restQuizzes.length > 0 && (
          <section className="animate-rise d5">
            <h2 className="display text-lg font-bold mb-5" style={{ color: "var(--gray-900)" }}>
              All {category.title} Quizzes
            </h2>
            <QuizGrid quizzes={restQuizzes} />
          </section>
        )}

        {quizzes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎮</p>
            <p className="display font-bold" style={{ color: "var(--gray-400)" }}>No quizzes in this topic yet</p>
          </div>
        )}

        {/* SEO content */}
        <section className="mt-14 mb-8 game-card p-8">
          <h2 className="display text-lg font-bold mb-3" style={{ color: "var(--gray-900)" }}>
            About {category.title} Quizzes
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--gray-500)" }}>
            Quizu offers a growing collection of {category.title.toLowerCase()} quizzes designed to entertain, educate, and help you discover something new.
            Whether you&apos;re looking for personality quizzes, trivia challenges, or polls — there&apos;s something for everyone.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--gray-500)" }}>
            Take a quiz, earn points, unlock badges, and challenge your friends. New content added regularly.
          </p>
        </section>
      </div>
    </div>
  );
}
