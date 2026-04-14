import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { CategoryBar } from "@/components/category-bar";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, personality, trivia, categories] = await Promise.all([
    prisma.quizMeta.findMany({
      where: { published: "2", username: "quizu", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 3,
    }),
    prisma.quizMeta.findMany({
      where: { published: "2", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 12,
    }),
    prisma.quizMeta.findMany({
      where: { published: "2", type: { in: ["personality", "personalityalt"] }, NOT: { title: "" }, username: "quizu" },
      orderBy: { id: "desc" },
      take: 6,
    }),
    prisma.quizMeta.findMany({
      where: { published: "2", type: "trivia", NOT: { title: "" }, username: "quizu" },
      orderBy: { id: "desc" },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ]);

  // Filter to categories with content
  const liveCats: typeof categories = [];
  for (const cat of categories) {
    const c = await prisma.quizMeta.count({ where: { category: cat.term, published: "2", NOT: { title: "" } } });
    if (c > 0) liveCats.push(cat);
  }

  const hero = featured[0];
  const hero2 = featured[1];

  return (
    <div style={{ background: "var(--white)" }}>
      <CategoryBar categories={liveCats} />

      {/* ═══ HERO — editorial split layout ═════════════ */}
      <section className="relative overflow-hidden noise" style={{ background: "var(--grad-dark)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            {/* Left — headline */}
            <div className="animate-enter">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2 h-2 rounded-full glow-pulse" style={{ background: "var(--cyan)" }} />
                <span className="mono text-[11px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
                  33,000+ QUIZZES LIVE
                </span>
              </div>
              <h1 className="display text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white leading-[1.05] tracking-tight">
                Take the quiz.<br />
                <span className="text-gradient-vivid">Know yourself.</span>
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                Personality tests, trivia, polls, and impossible dilemmas.
                Thirty thousand quizzes. Zero excuses.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Link href="/browse" className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold text-[var(--stone-900)] bg-white hover:bg-gray-100 transition-all display">
                  Explore quizzes
                </Link>
                <Link href="/personality" className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold display transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Personality
                </Link>
              </div>
            </div>

            {/* Right — featured quiz card */}
            {hero && (
              <Link href={`/${hero.url || hero.id}`}
                className="animate-enter d2 card-hover block rounded-2xl overflow-hidden relative"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Colored top bar */}
                <div className="h-1" style={{ background: "var(--grad-brand)" }} />
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded"
                      style={{ background: "var(--pink-10)", color: "var(--pink)" }}>
                      FEATURED
                    </span>
                    <span className={`badge badge-${hero.type}`}>
                      {hero.type === "personalityalt" ? "personality" : hero.type}
                    </span>
                  </div>
                  <h2 className="display text-xl sm:text-2xl font-bold text-white leading-snug">
                    {hero.title}
                  </h2>
                  {hero.description && (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {hero.description}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-3">
                    <span className="display text-sm font-bold text-white px-4 py-2 rounded-lg" style={{ background: "var(--grad-brand)" }}>
                      Take this quiz
                    </span>
                    {Number(hero.taken) > 0 && (
                      <span className="mono text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {Number(hero.taken).toLocaleString()} taken
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══ TRENDING ════════════════════════════════ */}
        <section className="mt-12 animate-enter d3">
          <SectionHead title="Trending" href="/browse" />
          <QuizGrid quizzes={latest} />
        </section>

        {/* ═══ RANKED TABLES — side by side ════════════ */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2 animate-enter d4">
          <RichTable title="Most Popular" subtitle="Top plays" accent="pink" viewAllHref="/browse" quizzes={latest.slice(0, 8)} />
          <RichTable title="Brain Busters" subtitle="Trivia that stumps" accent="cyan" viewAllHref="/trivia" quizzes={trivia} />
        </section>

        {/* ═══ PERSONALITY ═════════════════════════════ */}
        {personality.length > 0 && (
          <section className="mt-16">
            <SectionHead title="Personality" sub="Who are you, really?" href="/personality" />
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* ═══ TOPICS ═════════════════════════════════ */}
        {liveCats.length > 0 && (
          <section className="mt-16">
            <h2 className="display text-lg font-bold mb-4" style={{ color: "var(--stone-900)" }}>Topics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {liveCats.map(cat => (
                <Link key={cat.id} href={`/topic/${cat.term}`}
                  className="card-hover rounded-xl border p-4 text-center"
                  style={{ borderColor: "var(--stone-100)" }}>
                  <p className="display font-bold text-sm" style={{ color: "var(--stone-800)" }}>{cat.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ CTA ════════════════════════════════════ */}
        <section className="mt-16 mb-8 rounded-2xl overflow-hidden relative noise" style={{ background: "var(--grad-dark)" }}>
          <div className="relative px-8 py-14 text-center">
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready for more?
            </h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              Thousands of quizzes. Dozens of categories. Always something new.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/browse" className="cta-btn" style={{ background: "white", color: "var(--stone-900)" }}>
                Explore all quizzes
              </Link>
              <Link href="/auth/signup" className="display inline-flex items-center rounded-[10px] px-6 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({ title, sub, href }: { title: string; sub?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="display text-xl font-extrabold tracking-tight" style={{ color: "var(--stone-900)" }}>
          {title}
        </h2>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--stone-400)" }}>{sub}</p>}
      </div>
      <Link href={href} className="display text-xs font-bold transition-colors hover:text-[var(--cyan)]"
        style={{ color: "var(--stone-400)" }}>
        See all
      </Link>
    </div>
  );
}
