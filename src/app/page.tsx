import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { CategoryBar } from "@/components/category-bar";
import { SortableTable } from "@/components/sortable-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, personality, trivia, categories] = await Promise.all([
    prisma.quizMeta.findMany({ where: { published: "2", username: "quizu", NOT: { title: "" } }, orderBy: { id: "desc" }, take: 3 }),
    prisma.quizMeta.findMany({ where: { published: "2", NOT: { title: "" } }, orderBy: { id: "desc" }, take: 12 }),
    prisma.quizMeta.findMany({ where: { published: "2", type: { in: ["personality", "personalityalt"] }, NOT: { title: "" }, username: "quizu" }, orderBy: { id: "desc" }, take: 6 }),
    prisma.quizMeta.findMany({ where: { published: "2", type: "trivia", NOT: { title: "" }, username: "quizu" }, orderBy: { id: "desc" }, take: 10 }),
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

      {/* ═══ HERO — compact and punchy ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 left-[10%] w-48 h-48 rounded-full blur-[80px] opacity-20 float" style={{ background: "var(--cyan)" }} />
        <div className="absolute bottom-5 right-[15%] w-40 h-40 rounded-full blur-[70px] opacity-15" style={{ background: "var(--pink)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div className="animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-4"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <div className="w-2 h-2 rounded-full glow" style={{ background: "var(--green)" }} />
                <span className="mono text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  33,844 QUIZZES LIVE
                </span>
              </div>

              <h1 className="display text-[clamp(2rem,5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-tight">
                Play. Discover.<br/>
                <span className="text-gradient-vivid">Level up.</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
                Personality quizzes, trivia, polls — earn points, unlock badges, climb the ranks.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <Link href="/browse" className="cta-btn"><span>Start playing</span></Link>
                <Link href="/personality" className="display inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  Personality
                </Link>
              </div>
            </div>

            {/* Stacked cards */}
            <div className="hidden lg:block relative h-[280px] animate-rise d2">
              {heroCards.map((q, i) => {
                const offsets = [{ top: 0, right: 0, rotate: "2deg", z: 30 }, { top: 25, right: 25, rotate: "-1deg", z: 20 }, { top: 50, right: 50, rotate: "1.5deg", z: 10 }];
                const o = offsets[i];
                return (
                  <Link key={q.id} href={`/${q.url || q.id}`}
                    className="absolute block w-[300px] rounded-2xl overflow-hidden transition-all duration-300 hover:!rotate-0 hover:!translate-y-[-8px] hover:shadow-2xl"
                    style={{ top: o.top, right: o.right, transform: `rotate(${o.rotate})`, zIndex: o.z, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                    <div className="h-1 shimmer" style={{ background: "var(--grad-brand)" }} />
                    <div className="p-5">
                      <span className={`badge badge-${q.type}`} style={{ fontSize: "9px" }}>{q.type === "personalityalt" ? "personality" : q.type}</span>
                      <h3 className="display text-base font-bold text-white mt-2 leading-snug line-clamp-2">{q.title}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="play-btn" style={{ width: "28px", height: "28px", borderRadius: "8px" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <span className="mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
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
        {/* Trending grid */}
        <section className="mt-10 animate-rise d3">
          <SectionHead title="Trending Now" href="/browse" />
          <QuizGrid quizzes={latest} />
        </section>

        {/* Sortable leaderboard */}
        <section className="mt-12 animate-rise d4">
          <SortableTable quizzes={trivia} title="Trivia Leaderboard" />
        </section>

        {/* Personality */}
        {personality.length > 0 && (
          <section className="mt-12">
            <SectionHead title="Personality" sub="Who are you, really?" href="/personality" />
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* Badges CTA */}
        <section className="mt-12 game-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex -space-x-2">
              {["🍼", "🧠", "🐓", "💎", "👑"].map((e, i) => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-white flex items-center justify-center text-lg" style={{ background: "var(--white)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{e}</div>
              ))}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="display text-base font-bold" style={{ color: "var(--gray-900)" }}>Earn badges. Flex on your friends.</h3>
              <p className="text-sm mt-0.5" style={{ color: "var(--gray-400)" }}>24 badges from Common to Legendary.</p>
            </div>
            <Link href="/badges" className="cta-btn shrink-0" style={{ padding: "8px 20px", fontSize: "12px" }}><span>View badges</span></Link>
          </div>
        </section>

        {/* Topics */}
        {liveCats.length > 0 && (
          <section className="mt-12 mb-8">
            <h2 className="display text-base font-bold mb-4" style={{ color: "var(--gray-900)" }}>Topics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {liveCats.map(cat => (
                <Link key={cat.id} href={`/topic/${cat.term}`} className="game-card p-4 text-center">
                  <p className="display font-bold text-sm" style={{ color: "var(--gray-800)" }}>{cat.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHead({ title, sub, href }: { title: string; sub?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="display text-lg font-extrabold tracking-tight" style={{ color: "var(--gray-900)" }}>{title}</h2>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{sub}</p>}
      </div>
      <Link href={href} className="display text-xs font-bold transition-colors hover:text-[var(--cyan)]" style={{ color: "var(--gray-400)" }}>See all</Link>
    </div>
  );
}
