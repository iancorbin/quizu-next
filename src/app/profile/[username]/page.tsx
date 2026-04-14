import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s Profile — Quizu`,
    description: `See ${username}'s quiz activity, results, and points on Quizu.`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) notFound();

  const [createdQuizzes, takenCount, comments] = await Promise.all([
    prisma.quizMeta.findMany({
      where: { username: user.username, published: "2", NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 20,
    }),
    prisma.userTaken.count({ where: { username: user.username } }),
    prisma.comment.count({ where: { userId: user.id } }),
  ]);

  const joinDate = user.timestamp
    ? new Date(Number(user.timestamp) * (user.timestamp.length > 10 ? 1 : 1000)).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium mb-8" style={{ color: "var(--gray-400)" }}>
        <Link href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</Link>
        <span>›</span>
        <span style={{ color: "var(--gray-600)" }}>@{user.username}</span>
      </div>

      {/* Profile header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
          style={{ background: "var(--gradient-brand)", color: "white", fontFamily: "var(--font-display)" }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            @{user.username}
          </h1>
          {user.description && (
            <p className="mt-1 text-sm" style={{ color: "var(--gray-500)" }}>{user.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--gray-500)" }}>
            <span className="flex items-center gap-1.5 font-bold" style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
              💎 {user.points.toLocaleString()} points
            </span>
            <span>{createdQuizzes.length} quizzes created</span>
            <span>{takenCount} quizzes taken</span>
            <span>{comments} comments</span>
            <span>Joined {joinDate}</span>
          </div>
        </div>
      </div>

      <div className="neon-line-thin w-full mb-10" />

      {/* Created quizzes */}
      {createdQuizzes.length > 0 ? (
        <RichTable
          title={`Quizzes by @${user.username}`}
          subtitle={`${createdQuizzes.length} quizzes`}
          accent="cyan"
          quizzes={createdQuizzes}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-semibold" style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
            No quizzes created yet
          </p>
        </div>
      )}
    </div>
  );
}
