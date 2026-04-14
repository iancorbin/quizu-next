import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { CategoryBar } from "@/components/category-bar";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, personality, trivia, categories] = await Promise.all([
    prisma.quizMeta.findMany({ where: { published: "2", username: "quizu", NOT: { title: "" } }, orderBy: { id: "desc" }, take: 3 }),
    prisma.quizMeta.findMany({ where: { published: "2", NOT: { title: "" } }, orderBy: { id: "desc" }, take: 12 }),
    prisma.quizMeta.findMany({ where: { published: "2", type: { in: ["personality", "personalityalt"] }, NOT: { title: "" }, username: "quizu" }, orderBy: { id: "desc" }, take: 6 }),
    prisma.quizMeta.findMany({ where: { published: "2", type: "trivia", NOT: { title: "" }, username: "quizu" }, orderBy: { id: "desc" }, take: 8 }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ]);

  const liveCats: typeof categories = [];
  for (const cat of categories) {
    const c = await prisma.quizMeta.count({ where: { category: cat.term, published: "2", NOT: { title: "" } } });
    if (c > 0) liveCats.push(cat);
  }

  const hero = featured[0];

  return (
    <div style={{ background: "var(--white)" }}>
      <CategoryBar categories={liveCats} />

      {/* ═══ HERO ═════════════════════════════════════ */}
      <section className="relative overflow-hidden grain" style={{ background: "var(--warm-900)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-14 items-center">
            <div className="animate-rise">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full glow" style={{ background: "var(--cyan)" }} />
                <span className="code text-[11px] tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  33,000+ QUIZZES
                </span>
              </div>
              <h1 className="head text-[clamp(2.5rem,6vw,4.5rem)] font-black text-white leading-[1.05] italic">
                Take the quiz.<br />
                <span className="text-gradient-vivid not-italic">Know yourself.</span>
              </h1>
              <p className="mt-6 text-base leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                Personality tests, trivia challenges, polls, and impossible dilemmas.
                Find out who you really are.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Link href="/browse" className="inline-flex items-center gap-2 rounded-[var(--r-md)] px-7 py-3.5 text-sm font-extrabold bg-white text-[var(--warm-900)] hover:bg-gray-100 transition-all">
                  Explore quizzes
                </Link>
                <Link href="/personality" className="inline-flex items-center gap-2 rounded-[var(--r-md)] px-7 py-3.5 text-sm font-bold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Personality
                </Link>
              </div>
            </div>

            {hero && (
              <Link href={`/${hero.url || hero.id}`} className="animate-rise d2 card-lift block rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="h-1" style={{ background: "var(--grad-brand)" }} />
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="code text-[10px] font-bold tracking-widest px-2 py-0.5 rounded" style={{ background: "var(--pink-10)", color: "var(--pink)" }}>FEATURED</span>
                    <span className={`badge badge-${hero.type}`}>{hero.type === "personalityalt" ? "personality" : hero.type}</span>
                  </div>
                  <h2 className="head text-2xl sm:text-3xl font-bold text-white leading-snug italic">{hero.title}</h2>
                  {hero.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{hero.description}</p>}
                  <div className="mt-6 inline-flex items-center gap-2 rounded-[var(--r-md)] px-5 py-2.5 text-sm font-extrabold text-white" style={{ background: "var(--grad-brand)" }}>
                    Take this quiz
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trending */}
        <section className="mt-14 animate-rise d3">
          <Heading title="Trending" href="/browse" />
          <QuizGrid quizzes={latest} />
        </section>

        {/* Ranked tables */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2 animate-rise d4">
          <RichTable title="Most Popular" subtitle="Top plays" accent="pink" viewAllHref="/browse" quizzes={latest.slice(0, 8)} />
          <RichTable title="Brain Busters" subtitle="Trivia that stumps" accent="cyan" viewAllHref="/trivia" quizzes={trivia} />
        </section>

        {/* Personality */}
        {personality.length > 0 && (
          <section className="mt-16">
            <Heading title="Personality" sub="Who are you, really?" href="/personality" />
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* Topics */}
        {liveCats.length > 0 && (
          <section className="mt-16">
            <h2 className="head text-2xl font-bold italic mb-5" style={{ color: "var(--warm-900)" }}>Topics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {liveCats.map(cat => (
                <Link key={cat.id} href={`/topic/${cat.term}`} className="card-lift rounded-xl border p-5 text-center" style={{ borderColor: "var(--warm-100)" }}>
                  <p className="font-bold text-sm" style={{ color: "var(--warm-800)" }}>{cat.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 mb-8 rounded-2xl overflow-hidden relative grain" style={{ background: "var(--warm-900)" }}>
          <div className="relative px-8 py-16 text-center">
            <h2 className="head text-4xl sm:text-5xl font-black text-white italic">Ready for more?</h2>
            <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
              Thousands of quizzes. Dozens of categories. Always something new.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/browse" className="cta-btn" style={{ background: "white", color: "var(--warm-900)" }}>Explore all quizzes</Link>
              <Link href="/auth/signup" className="inline-flex items-center rounded-[var(--r-md)] px-6 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Heading({ title, sub, href }: { title: string; sub?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="head text-2xl font-bold italic" style={{ color: "var(--warm-900)" }}>{title}</h2>
        {sub && <p className="text-sm mt-0.5" style={{ color: "var(--warm-400)" }}>{sub}</p>}
      </div>
      <Link href={href} className="text-xs font-bold transition-colors hover:text-[var(--cyan)]" style={{ color: "var(--warm-400)" }}>See all</Link>
    </div>
  );
}
