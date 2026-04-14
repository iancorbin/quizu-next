import { prisma } from "@/lib/prisma";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch premium content first (our seeded quizzes), then popular legacy
  const [premium, personality, trivia, polls, categories] = await Promise.all([
    prisma.quizMeta.findMany({
      where: { published: "2", username: "quizu", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 6,
    }),
    prisma.quizMeta.findMany({
      where: { published: "2", type: { in: ["personality", "personalityalt"] }, NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 15,
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

  const hero = premium[0];
  const stories = premium.slice(0, 6);
  const typeNav = [
    { type: "personality", label: "Personality", emoji: "✨", count: "27K+" },
    { type: "trivia", label: "Trivia", emoji: "🧠", count: "18+" },
    { type: "poll", label: "Polls", emoji: "📊", count: "55+" },
    { type: "list", label: "Lists", emoji: "📝", count: "6+" },
    { type: "vs", label: "Would You Rather", emoji: "⚡", count: "9+" },
  ];

  return (
    <div style={{ background: "var(--white)" }}>
      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gray-900)" }}>
        {/* Gradient orbs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: "var(--neon-cyan)" }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15" style={{ background: "var(--neon-pink)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div className="animate-in">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-6"
                style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
                <span className="w-2 h-2 rounded-full pulse-glow" style={{ background: "var(--neon-cyan)" }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  33,000+ quizzes live
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 800, lineHeight: 1.1, color: "var(--white)" }}>
                The quiz that<br />
                <span className="text-gradient-vivid">defines you</span><br />
                is waiting.
              </h1>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "420px" }}>
                Personality quizzes, trivia, polls, and more.
                Take one. Share your result. Challenge your friends.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/browse" className="cta-btn">
                  Explore Quizzes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <Link href="/browse?type=personality" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "var(--font-display)" }}>
                  ✨ Personality Quizzes
                </Link>
              </div>
            </div>

            {/* Right — featured quiz CTA */}
            {hero && (
              <Link href={`/${hero.url || hero.id}`} className="featured-card block animate-in delay-2"
                style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.1), rgba(255,45,135,0.1))", border: "1px solid rgba(255,255,255,0.1)", padding: "32px" }}>
                <span className={`badge badge-${hero.type}`}>{hero.type === "personalityalt" ? "Personality" : hero.type}</span>
                <h2 className="mt-4 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}>
                  {hero.title}
                </h2>
                <p className="mt-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{hero.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
                  style={{ background: "var(--gradient-brand)", color: "white" }}>
                  Take This Quiz →
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ═══ STORY STRIP ══════════════════════════════ */}
        <section className="mt-10 -mx-4 sm:mx-0">
          <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-4 no-scrollbar">
            {stories.map((q, i) => (
              <Link key={q.id} href={`/${q.url || q.id}`} className={`story-bubble animate-in delay-${i + 1}`}>
                <div className="story-ring">
                  <div className="story-ring-inner">
                    {q.type === "personality" || q.type === "personalityalt" ? "✨" : q.type === "trivia" ? "🧠" : q.type === "poll" ? "📊" : q.type === "list" ? "📝" : "⚡"}
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-medium leading-tight line-clamp-2 px-1" style={{ color: "var(--gray-600)" }}>
                  {q.title}
                </p>
              </Link>
            ))}
            {/* Browse all bubble */}
            <Link href="/browse" className="story-bubble">
              <div className="story-ring" style={{ background: "var(--gray-200)" }}>
                <div className="story-ring-inner" style={{ fontSize: "18px" }}>→</div>
              </div>
              <p className="mt-2 text-center text-xs font-medium" style={{ color: "var(--gray-400)" }}>View All</p>
            </Link>
          </div>
        </section>

        {/* ═══ TYPE NAV GRID ════════════════════════════ */}
        <section className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {typeNav.map((t, i) => (
            <Link key={t.type} href={`/browse?type=${t.type}`}
              className={`animate-in delay-${i + 1} group flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all hover:border-[var(--neon-cyan)] hover:shadow-md`}
              style={{ borderColor: "var(--gray-100)", background: "var(--white)" }}>
              <span className="text-3xl">{t.emoji}</span>
              <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>{t.label}</span>
              <span className="text-xs font-medium" style={{ color: "var(--gray-400)" }}>{t.count} quizzes</span>
            </Link>
          ))}
        </section>

        {/* ═══ PERSONALITY QUIZZES TABLE ═════════════════ */}
        <section className="mt-14">
          <RichTable
            title="Personality Quizzes"
            subtitle="Which one are you? There's only one way to find out."
            accent="pink"
            viewAllHref="/browse?type=personality"
            quizzes={personality}
          />
        </section>

        {/* ═══ TRIVIA TABLE ═════════════════════════════ */}
        {trivia.length > 0 && (
          <section className="mt-10">
            <RichTable
              title="Trivia Challenges"
              subtitle="Put your knowledge to the test."
              accent="cyan"
              viewAllHref="/browse?type=trivia"
              quizzes={trivia}
            />
          </section>
        )}

        {/* ═══ POLLS TABLE ══════════════════════════════ */}
        {polls.length > 0 && (
          <section className="mt-10">
            <RichTable
              title="Polls"
              subtitle="Cast your vote. See where you stand."
              accent="cyan"
              viewAllHref="/browse?type=poll"
              quizzes={polls}
            />
          </section>
        )}

        {/* ═══ TOPICS / SEO ═════════════════════════════ */}
        {categories.length > 0 && (
          <section className="mt-14 mb-4">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              Explore Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/topic/${cat.term}`}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] hover:shadow-sm"
                  style={{ borderColor: "var(--gray-200)", color: "var(--gray-600)" }}>
                  {cat.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
