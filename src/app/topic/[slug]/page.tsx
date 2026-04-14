import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { Metadata } from "next";

// Editorial content for SEO — rich descriptions per topic
const topicContent: Record<string, { intro: string; facts: string[]; cta: string }> = {
  personality: {
    intro: "Personality quizzes are the internet's favorite way to learn about yourself. From your Myers-Briggs type to your Hogwarts house, these quizzes reveal hidden aspects of who you are — and they're incredibly fun to share with friends.",
    facts: ["Over 50% of people share their personality quiz results on social media", "The Myers-Briggs Type Indicator is the world's most popular personality assessment", "Personality quizzes have been a staple of internet culture since the early 2000s"],
    cta: "Discover something new about yourself. Take a personality quiz below.",
  },
  entertainment: {
    intro: "Think you know movies, TV shows, and pop culture? Our entertainment quizzes cover everything from Marvel trivia to Disney villains, classic sitcoms to streaming hits. Put your knowledge to the test.",
    facts: ["The average person watches over 4 hours of TV per day", "Marvel has released over 30 films in the MCU", "Streaming services now produce more original content than traditional networks"],
    cta: "How well do you really know your favorite shows and movies? Find out.",
  },
  science: {
    intro: "Science quizzes that range from 8th grade basics to PhD-level challenges. Test your knowledge of biology, chemistry, physics, astronomy, and everything in between.",
    facts: ["Only 28% of American adults are considered scientifically literate", "The human body contains enough carbon to fill 9,000 pencils", "A day on Venus is longer than a year on Venus"],
    cta: "Are you smarter than you think? Take a science quiz and find out.",
  },
  technology: {
    intro: "From the birth of the internet to the rise of AI, technology has transformed every aspect of our lives. How well do you understand the tech that shapes your world?",
    facts: ["The first website went live on August 6, 1991", "There are over 700 programming languages in existence", "The average person checks their phone 144 times per day"],
    cta: "Prove you're a true tech nerd. Take a technology quiz.",
  },
  music: {
    intro: "From opening lyrics to iconic albums, from jazz legends to modern pop stars — music quizzes that test the depth of your musical knowledge and reveal your sonic personality.",
    facts: ["Music activates more parts of the brain than any other activity", "The most-streamed song on Spotify has over 4 billion plays", "Listening to music can improve your workout performance by up to 15%"],
    cta: "What does your music taste say about you? Take a music quiz.",
  },
  history: {
    intro: "Those who don't know history are doomed to repeat it — but also doomed to fail these quizzes. From ancient civilizations to modern politics, test your knowledge of the past.",
    facts: ["Cleopatra lived closer in time to the moon landing than to the building of the pyramids", "Oxford University is older than the Aztec Empire", "The shortest war in history lasted 38 minutes"],
    cta: "Are you smarter than a history professor? There's only one way to find out.",
  },
  lifestyle: {
    intro: "Food, travel, coffee, and everything that makes life interesting. Our lifestyle quizzes reveal your tastes, preferences, and the choices that define your daily life.",
    facts: ["Coffee is the world's second most traded commodity after oil", "The average person makes over 35,000 decisions per day", "Travel is consistently rated as one of the top contributors to happiness"],
    cta: "What do your lifestyle choices say about you? Take a quiz.",
  },
  sports: {
    intro: "From the Super Bowl to the World Cup, from the NBA to the Olympics — how deep does your sports knowledge really go? These quizzes separate the casual fans from the true experts.",
    facts: ["The Olympics have been held every 4 years since 1896", "A golf ball has 336 dimples", "The FIFA World Cup is the most-watched sporting event on Earth"],
    cta: "Think you're the ultimate sports fan? Prove it.",
  },
  movies: {
    intro: "Lights, camera, quiz! From 90s classics to modern blockbusters, from indie gems to franchise juggernauts — test how well you really know cinema.",
    facts: ["The first movie ever made was in 1888", "Avatar held the highest-grossing film record for over 10 years", "The average Hollywood movie costs $65 million to produce"],
    cta: "How well do you know the silver screen? Take a movie quiz.",
  },
  popculture: {
    intro: "Memes, viral moments, celebrity drama, and the cultural zeitgeist. Pop culture moves fast — can you keep up? These quizzes test your knowledge of everything trending.",
    facts: ["The term 'pop culture' was first used in the 1950s", "TikTok has over 1 billion monthly active users", "The average viral trend lasts about 2-3 weeks"],
    cta: "Are you truly plugged in to pop culture? Take a quiz and see.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { term: slug } });
  if (!category) return { title: "Topic Not Found" };

  const content = topicContent[slug];
  const desc = content?.intro?.slice(0, 155) || `Take ${category.title.toLowerCase()} quizzes on Quizu.`;

  return {
    title: `${category.title} Quizzes — Take Free ${category.title} Quizzes Online | Quizu`,
    description: desc,
    openGraph: {
      title: `${category.title} Quizzes — Quizu`,
      description: desc,
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { term: slug } });
  if (!category) notFound();

  const [quizzes, allCategories, quizCount] = await Promise.all([
    prisma.quizMeta.findMany({
      where: { published: "2", category: category.term, NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 50,
    }),
    prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 }),
    prisma.quizMeta.count({ where: { published: "2", category: category.term, NOT: { title: "" } } }),
  ]);

  const content = topicContent[slug];

  return (
    <div>
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: "var(--gray-900)" }}>
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-[100px] opacity-15" style={{ background: "var(--neon-cyan)" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-xs font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/browse" className="hover:text-white transition-colors">Quizzes</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{category.title}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}>
            {category.title} <span className="text-gradient-vivid">Quizzes</span>
          </h1>
          <p className="mt-3 text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            {content?.intro || `Explore the best ${category.title.toLowerCase()} quizzes, trivia, and polls on Quizu.`}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span className="font-bold" style={{ color: "var(--neon-cyan)" }}>{quizCount} quizzes</span>
          </div>
        </div>
        <div className="neon-line-thin" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Editorial facts */}
        {content?.facts && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {content.facts.map((fact, i) => (
              <div key={i} className="rounded-xl border p-5" style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}>
                <span className="text-2xl mb-2 block">{["📊", "🔬", "💡"][i % 3]}</span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>{fact}</p>
              </div>
            ))}
          </div>
        )}

        {content?.cta && (
          <p className="text-lg font-semibold mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
            {content.cta}
          </p>
        )}

        {/* Topic pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <Link key={cat.id} href={`/topic/${cat.term}`}
              className="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={{
                fontFamily: "var(--font-display)",
                borderColor: cat.term === slug ? "var(--neon-cyan)" : "var(--gray-200)",
                background: cat.term === slug ? "var(--neon-cyan-soft)" : "var(--white)",
                color: cat.term === slug ? "var(--neon-cyan)" : "var(--gray-500)",
              }}>
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Quiz table */}
        {quizzes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>No quizzes in this topic yet</p>
          </div>
        ) : (
          <RichTable
            title={`${category.title} Quizzes`}
            subtitle={`${quizzes.length} quizzes`}
            accent="cyan"
            quizzes={quizzes}
          />
        )}

        {/* SEO footer text */}
        <div className="mt-12 rounded-2xl p-8" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
            About {category.title} Quizzes on Quizu
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--gray-600)" }}>
            Quizu offers a growing collection of {category.title.toLowerCase()} quizzes designed to entertain, educate, and help you discover something new about yourself.
            Whether you&apos;re looking for personality quizzes, trivia challenges, polls, or more — our {category.title.toLowerCase()} section has something for everyone.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>
            Each quiz is crafted with care to be both engaging and shareable. Take a quiz, discover your result, and challenge your friends to beat your score.
            New {category.title.toLowerCase()} quizzes are added regularly, so check back often for fresh content.
          </p>
        </div>
      </div>
    </div>
  );
}
