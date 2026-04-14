import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RichTable } from "@/components/rich-table";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username}'s Profile — Quizu`, description: `See ${username}'s quiz activity, badges, and points on Quizu.` };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) notFound();

  const [createdQuizzes, takenCount, comments, userBadges] = await Promise.all([
    prisma.quizMeta.findMany({ where: { username: user.username, published: "2", NOT: { title: "" } }, orderBy: { id: "desc" }, take: 20 }),
    prisma.userTaken.count({ where: { username: user.username } }),
    prisma.comment.count({ where: { userId: user.id } }),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, orderBy: { earnedAt: "desc" } }),
  ]);

  const joinDate = user.timestamp
    ? new Date(Number(user.timestamp) * (user.timestamp.length > 10 ? 1 : 1000)).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  // Calculate "level" from points
  const level = Math.floor(user.points / 100) + 1;
  const xpInLevel = user.points % 100;

  return (
    <div>
      {/* Game hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 right-[20%] w-48 h-48 rounded-full blur-[80px] opacity-20 float" style={{ background: "var(--purple)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>@{user.username}</span>
          </div>

          <div className="flex items-start gap-6 animate-rise">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shrink-0 display"
              style={{ background: "var(--grad-brand)", color: "white", boxShadow: "0 4px 20px rgba(0,229,255,0.25)" }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="display text-3xl font-extrabold text-white tracking-tight">@{user.username}</h1>
              {user.description && <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{user.description}</p>}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="mono text-[11px] font-bold" style={{ color: "var(--cyan)" }}>{user.points.toLocaleString()} pts</span>
                </div>
                <span className="mono text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  LVL {level}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{createdQuizzes.length} created</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{takenCount} taken</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{comments} comments</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Joined {joinDate}</span>
              </div>

              {/* XP bar */}
              <div className="mt-3 max-w-xs">
                <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpInLevel}%` }} /></div>
                <p className="mono text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{xpInLevel}/100 to next level</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-6" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-2">
        {/* Badges */}
        {userBadges.length > 0 && (
          <section className="mb-10 animate-rise d2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="display text-lg font-bold" style={{ color: "var(--gray-900)" }}>Badges ({userBadges.length})</h2>
              <Link href="/badges" className="display text-xs font-bold hover:text-[var(--cyan)]" style={{ color: "var(--gray-400)" }}>View all badges</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {userBadges.map(ub => (
                <div key={ub.id} className="game-card px-4 py-3 flex items-center gap-2" title={ub.badge.description}>
                  <span className="text-2xl">{ub.badge.emoji}</span>
                  <div>
                    <span className="display text-xs font-bold" style={{ color: "var(--gray-700)" }}>{ub.badge.name}</span>
                    <p className="mono text-[9px]" style={{ color: "var(--gray-400)" }}>{ub.badge.rarity}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Created quizzes */}
        <section className="mb-8 animate-rise d3">
          {createdQuizzes.length > 0 ? (
            <RichTable title={`Quizzes by @${user.username}`} subtitle={`${createdQuizzes.length} quizzes`} accent="cyan" quizzes={createdQuizzes} />
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎮</p>
              <p className="display font-bold" style={{ color: "var(--gray-400)" }}>No quizzes created yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
