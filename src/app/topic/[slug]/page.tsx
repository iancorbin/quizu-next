import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { term: slug } });
  if (!category) return { title: "Topic Not Found" };

  return {
    title: `${category.title} Quizzes — Quizu`,
    description: `Take ${category.title.toLowerCase()} quizzes on Quizu. Personality quizzes, trivia, polls, and more about ${category.title.toLowerCase()}.`,
    openGraph: {
      title: `${category.title} Quizzes — Quizu`,
      description: `Discover the best ${category.title.toLowerCase()} quizzes, trivia, and polls on Quizu.`,
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { term: slug } });
  if (!category) notFound();

  const quizzes = await prisma.quizMeta.findMany({
    where: { published: "2", category: category.term, NOT: { title: "" } },
    orderBy: { id: "desc" },
    take: 50,
  });

  const allCategories = await prisma.category.findMany({ orderBy: { id: "asc" }, take: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "var(--gray-400)" }}>
        <Link href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</Link>
        <span>›</span>
        <Link href="/browse" className="hover:text-[var(--neon-cyan)] transition-colors">Quizzes</Link>
        <span>›</span>
        <span style={{ color: "var(--gray-600)" }}>{category.title}</span>
      </div>

      <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
        {category.title} Quizzes
      </h1>
      {category.description && (
        <p className="mt-2 text-base" style={{ color: "var(--gray-500)" }}>{category.description}</p>
      )}

      {/* Other topics */}
      <div className="mt-6 flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <Link key={cat.id} href={`/topic/${cat.term}`}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
            style={{
              borderColor: cat.term === slug ? "var(--neon-cyan)" : "var(--gray-200)",
              background: cat.term === slug ? "var(--neon-cyan-soft)" : "var(--white)",
              color: cat.term === slug ? "var(--neon-cyan)" : "var(--gray-500)",
            }}>
            {cat.title}
          </Link>
        ))}
      </div>

      {/* Results */}
      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🤷</p>
          <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
            No quizzes in this topic yet
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <RichTable
            title={`${category.title}`}
            subtitle={`${quizzes.length} quizzes`}
            accent="cyan"
            quizzes={quizzes}
          />
        </div>
      )}
    </div>
  );
}
