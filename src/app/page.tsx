import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { CategoryBar } from "@/components/category-bar";
import { FeaturedHero } from "@/components/featured-hero";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, personality, trivia, polls, categories] =
    await Promise.all([
      // Featured: premium quizzes with highest engagement
      prisma.quizMeta.findMany({
        where: { published: "2", username: "quizu", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 3,
      }),
      // Latest quizzes
      prisma.quizMeta.findMany({
        where: { published: "2", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 12,
      }),
      // Top personality
      prisma.quizMeta.findMany({
        where: {
          published: "2",
          type: { in: ["personality", "personalityalt"] },
          NOT: { title: "" },
          username: "quizu",
        },
        orderBy: { id: "desc" },
        take: 6,
      }),
      // Trivia
      prisma.quizMeta.findMany({
        where: { published: "2", type: "trivia", NOT: { title: "" }, username: "quizu" },
        orderBy: { id: "desc" },
        take: 6,
      }),
      // Polls
      prisma.quizMeta.findMany({
        where: { published: "2", type: "poll", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 6,
      }),
      prisma.category.findMany({ orderBy: { id: "asc" }, take: 25 }),
    ]);

  const hero = featured[0];

  return (
    <div style={{ background: "var(--white)" }}>
      {/* ═══ CATEGORY BAR ═══════════════════════════════ */}
      <CategoryBar categories={categories} />

      {/* ═══ FEATURED HERO ══════════════════════════════ */}
      {hero && <FeaturedHero quiz={hero} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══ TRENDING NOW ═════════════════════════════ */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <h2 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                Trending Now
              </h2>
            </div>
            <Link href="/browse" className="text-sm font-bold transition-colors hover:text-[var(--neon-cyan)]"
              style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
              See all →
            </Link>
          </div>
          <QuizGrid quizzes={latest} />
        </section>

        {/* ═══ PERSONALITY QUIZZES ══════════════════════ */}
        {personality.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h2 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                    Personality Quizzes
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>Discover who you really are</p>
                </div>
              </div>
              <Link href="/browse?type=personality" className="text-sm font-bold px-4 py-1.5 rounded-full transition-all hover:shadow-sm"
                style={{ background: "var(--neon-pink-soft)", color: "var(--neon-pink)", fontFamily: "var(--font-display)" }}>
                More ✨
              </Link>
            </div>
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* ═══ TRIVIA ══════════════════════════════════ */}
        {trivia.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h2 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                    Trivia Challenges
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>Test your knowledge</p>
                </div>
              </div>
              <Link href="/browse?type=trivia" className="text-sm font-bold px-4 py-1.5 rounded-full transition-all hover:shadow-sm"
                style={{ background: "var(--neon-cyan-soft)", color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
                More 🧠
              </Link>
            </div>
            <QuizGrid quizzes={trivia} columns={3} />
          </section>
        )}

        {/* ═══ POLLS ═══════════════════════════════════ */}
        {polls.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                    Polls &amp; Opinions
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>Cast your vote</p>
                </div>
              </div>
              <Link href="/browse?type=poll" className="text-sm font-bold px-4 py-1.5 rounded-full transition-all hover:shadow-sm"
                style={{ background: "#E5FFF0", color: "#0A7544", fontFamily: "var(--font-display)" }}>
                More 📊
              </Link>
            </div>
            <QuizGrid quizzes={polls} columns={3} />
          </section>
        )}

        {/* ═══ EXPLORE CTA ═════════════════════════════ */}
        <section className="mt-14 mb-6 rounded-3xl overflow-hidden relative" style={{ background: "var(--gray-900)" }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20" style={{ background: "var(--neon-cyan)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-15" style={{ background: "var(--neon-pink)" }} />
          <div className="relative px-8 py-12 text-center sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
              Ready for more?
            </h2>
            <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Explore 33,000+ quizzes across dozens of categories.
              There&apos;s always something new to discover.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/browse" className="cta-btn">
                Explore All Quizzes →
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)" }}>
                Create Account — it&apos;s free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
