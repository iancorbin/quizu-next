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
  const heroCards = featured.slice(0, 3);

  return (
    <div style={{ background: "var(--white)" }}>
      <CategoryBar categories={liveCats} />

      {/* ═══ HERO — game lobby ════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Glowing orbs */}
        <div className="absolute top-20 left-[10%] w-48 h-48 rounded-full blur-[80px] opacity-20 float" style={{ background: "var(--cyan)" }} />
        <div className="absolute bottom-10 right-[15%] w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "var(--pink)" }} />
        <div className="absolute top-40 right-[30%] w-32 h-32 rounded-full blur-[60px] opacity-10" style={{ background: "var(--purple)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            {/* Left */}
            <div className="animate-rise">
              <div className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 mb-6"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <div className="w-2 h-2 rounded-full glow" style={{ background: "var(--green)" }} />
                <span className="display text-[11px] font-bold tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
                  33,844 QUIZZES LIVE
                </span>
              </div>

              <h1 className="display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold text-white leading-[1.08] tracking-tight">
                Play. Discover.<br/>
                <span className="text-gradient-vivid">Level up.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                Personality quizzes, trivia challenges, polls — earn points,
                unlock badges, climb the ranks.
              </p>

              {/* XP-style stat bar */}
              <div className="mt-8 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="display text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>Community XP</span>
                  <span className="mono text-xs font-bold" style={{ color: "var(--cyan)" }}>LEVEL 42</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: "73%" }} />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Link href="/browse" className="cta-btn">
                  <span>Start playing</span>
                </Link>
                <Link href="/personality" className="display inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Personality
                </Link>
              </div>
            </div>

            {/* Right — stacked featured cards */}
            <div className="hidden lg:block relative h-[380px] animate-rise d2">
              {heroCards.map((q, i) => {
                const offsets = [
                  { top: 0, right: 0, rotate: "2deg", z: 30 },
                  { top: 30, right: 30, rotate: "-1deg", z: 20 },
                  { top: 60, right: 60, rotate: "1.5deg", z: 10 },
                ];
                const o = offsets[i];
                return (
                  <Link key={q.id} href={`/${q.url || q.id}`}
                    className="absolute block w-[340px] rounded-2xl overflow-hidden transition-all duration-300 hover:!rotate-0 hover:!translate-y-[-8px] hover:shadow-2xl"
                    style={{
                      top: o.top, right: o.right,
                      transform: `rotate(${o.rotate})`,
                      zIndex: o.z,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                    }}>
                    <div className="h-1 shimmer" style={{ background: "var(--grad-brand)" }} />
                    <div className="p-6">
                      <span className={`badge badge-${q.type}`} style={{ fontSize: "9px" }}>
                        {q.type === "personalityalt" ? "personality" : q.type}
                      </span>
                      <h3 className="display text-lg font-bold text-white mt-3 leading-snug line-clamp-2">
                        {q.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="play-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <span className="display text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {Number(q.taken) > 0 ? `${Number(q.taken).toLocaleString()} played` : "Play now"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══ TRENDING ═══════════════════════════════ */}
        <section className="mt-12 animate-rise d3">
          <GameSectionHead title="Trending Now" icon="🔥" href="/browse" />
          <QuizGrid quizzes={latest} />
        </section>

        {/* ═══ LEADERBOARD TABLES ═════════════════════ */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2 animate-rise d4">
          <RichTable title="Most Played" subtitle="Top by plays" accent="pink" viewAllHref="/browse" quizzes={latest.slice(0, 8)} />
          <RichTable title="Brain Busters" subtitle="Trivia that stumps" accent="cyan" viewAllHref="/trivia" quizzes={trivia} />
        </section>

        {/* ═══ PERSONALITY ════════════════════════════ */}
        {personality.length > 0 && (
          <section className="mt-14">
            <GameSectionHead title="Personality" icon="✨" sub="Who are you, really?" href="/personality" />
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* ═══ ACHIEVEMENTS CTA ═══════════════════════ */}
        <section className="mt-14 rounded-2xl p-8 sm:p-10 relative overflow-hidden" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex -space-x-2">
              {["🍼", "🧠", "🐓", "💎", "👑"].map((e, i) => (
                <div key={i} className="w-12 h-12 rounded-xl border-2 border-white flex items-center justify-center text-xl"
                  style={{ background: "var(--white)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {e}
                </div>
              ))}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="display text-lg font-bold" style={{ color: "var(--gray-900)" }}>
                Earn badges. Flex on your friends.
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--gray-400)" }}>
                24 badges from Common to Legendary. Can you unlock the Golden Chicken?
              </p>
            </div>
            <Link href="/badges" className="cta-btn shrink-0" style={{ padding: "10px 22px", fontSize: "13px" }}>
              <span>View badges</span>
            </Link>
          </div>
        </section>

        {/* ═══ TOPICS ════════════════════════════════ */}
        {liveCats.length > 0 && (
          <section className="mt-14">
            <h2 className="display text-lg font-bold mb-5" style={{ color: "var(--gray-900)" }}>Topics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {liveCats.map(cat => (
                <Link key={cat.id} href={`/topic/${cat.term}`}
                  className="game-card p-4 text-center">
                  <p className="display font-bold text-sm" style={{ color: "var(--gray-800)" }}>{cat.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ FINAL CTA ═════════════════════════════ */}
        <section className="mt-14 mb-8 rounded-2xl overflow-hidden relative" style={{ background: "var(--grad-game)" }}>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="relative px-8 py-16 text-center">
            <h2 className="display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to play?
            </h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
              Thousands of quizzes. Points to earn. Badges to unlock.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/browse" className="cta-btn" style={{ background: "white", color: "var(--gray-900)" }}>
                <span>Explore quizzes</span>
              </Link>
              <Link href="/auth/signup" className="display inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                Join free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function GameSectionHead({ title, icon, sub, href }: { title: string; icon: string; sub?: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--gray-50)" }}>
          {icon}
        </span>
        <div>
          <h2 className="display text-xl font-extrabold tracking-tight" style={{ color: "var(--gray-900)" }}>{title}</h2>
          {sub && <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{sub}</p>}
        </div>
      </div>
      <Link href={href} className="display text-xs font-bold transition-colors hover:text-[var(--cyan)]" style={{ color: "var(--gray-400)" }}>
        See all
      </Link>
    </div>
  );
}
