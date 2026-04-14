import { prisma } from "@/lib/prisma";
import { QuizGrid } from "@/components/quiz-grid";
import { CategoryBar } from "@/components/category-bar";
import { FeaturedHero } from "@/components/featured-hero";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, personality, trivia, polls, categories] =
    await Promise.all([
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
        take: 6,
      }),
      prisma.quizMeta.findMany({
        where: { published: "2", type: "poll", NOT: { title: "" } },
        orderBy: { id: "desc" },
        take: 6,
      }),
      // Only categories that have published quizzes
      prisma.category.findMany({ orderBy: { id: "asc" } }),
    ]);

  // Filter categories to only those with content
  const catsWithContent: typeof categories = [];
  for (const cat of categories) {
    const count = await prisma.quizMeta.count({
      where: { category: cat.term, published: "2", NOT: { title: "" } },
    });
    if (count > 0) catsWithContent.push(cat);
  }

  const hero = featured[0];

  return (
    <div style={{ background: "var(--white)" }}>
      <CategoryBar categories={catsWithContent} />

      {hero && <FeaturedHero quiz={hero} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trending */}
        <section className="mt-10">
          <SectionHeader title="Trending Now" href="/browse" />
          <QuizGrid quizzes={latest} />
        </section>

        {/* Ranked tables */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <RichTable title="Most Popular" subtitle="Top quizzes by plays" accent="pink" viewAllHref="/browse" quizzes={latest.slice(0, 8)} />
          <RichTable title="Brain Busters" subtitle="Trivia that stumps" accent="cyan" viewAllHref="/trivia" quizzes={trivia} />
        </section>

        {/* Personality */}
        {personality.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="Personality Quizzes" subtitle="Discover who you really are" href="/personality" />
            <QuizGrid quizzes={personality} columns={3} />
          </section>
        )}

        {/* Trivia */}
        {trivia.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="Trivia Challenges" subtitle="Test your knowledge" href="/trivia" />
            <QuizGrid quizzes={trivia} columns={3} />
          </section>
        )}

        {/* Polls */}
        {polls.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="Polls" subtitle="Cast your vote" href="/polls" />
            <QuizGrid quizzes={polls} columns={3} />
          </section>
        )}

        {/* Topics */}
        {catsWithContent.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
              Browse by Topic
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {catsWithContent.map(cat => (
                <Link key={cat.id} href={`/topic/${cat.term}`}
                  className="rounded-xl border p-4 text-center transition-all hover:border-[var(--neon-cyan)] hover:shadow-sm"
                  style={{ borderColor: "var(--gray-100)", fontFamily: "var(--font-display)" }}>
                  <p className="font-bold text-sm" style={{ color: "var(--gray-800)" }}>{cat.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-14 mb-6 rounded-3xl overflow-hidden relative" style={{ background: "var(--gray-900)" }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20" style={{ background: "var(--neon-cyan)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-15" style={{ background: "var(--neon-pink)" }} />
          <div className="relative px-8 py-12 text-center sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
              Ready for more?
            </h2>
            <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Thousands of quizzes across dozens of categories. There&apos;s always something new.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/browse" className="cta-btn">Explore All Quizzes</Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)" }}>
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          {title}
        </h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{subtitle}</p>}
      </div>
      <Link href={href} className="text-xs font-bold transition-colors hover:text-[var(--neon-cyan)]"
        style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
        See all
      </Link>
    </div>
  );
}
