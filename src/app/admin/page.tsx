import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminQuizTable } from "@/components/admin-quiz-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Quizu" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) } });
  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>Access Denied</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--gray-500)" }}>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const [totalQuizzes, totalUsers, totalComments, totalTaken, recentQuizzes, recentUsers] = await Promise.all([
    prisma.quizMeta.count({ where: { published: "2", NOT: { title: "" } } }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.userTaken.count(),
    prisma.quizMeta.findMany({
      where: { NOT: { title: "" } },
      orderBy: { id: "desc" },
      take: 20,
      select: { id: true, title: true, type: true, published: true, username: true, views: true, taken: true, url: true },
    }),
    prisma.user.findMany({
      orderBy: { id: "desc" },
      take: 10,
      select: { id: true, username: true, email: true, role: true, points: true, status: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            ⚙️ Admin Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--gray-400)" }}>
            Manage quizzes, users, and site content.
          </p>
        </div>
        <Link href="/" className="text-sm font-bold hover:text-[var(--neon-cyan)]" style={{ color: "var(--gray-400)" }}>
          ← Back to site
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Published Quizzes", value: totalQuizzes.toLocaleString(), emoji: "📝", color: "var(--neon-cyan)" },
          { label: "Users", value: totalUsers.toLocaleString(), emoji: "👥", color: "var(--neon-pink)" },
          { label: "Comments", value: totalComments.toLocaleString(), emoji: "💬", color: "#A855F7" },
          { label: "Quizzes Taken", value: totalTaken.toLocaleString(), emoji: "🎯", color: "#F59E0B" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border p-5" style={{ borderColor: "var(--gray-100)" }}>
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-2xl font-black mt-2" style={{ fontFamily: "var(--font-display)", color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium mt-1" style={{ color: "var(--gray-400)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent quizzes */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          Recent Quizzes
        </h2>
        <AdminQuizTable quizzes={recentQuizzes} />
      </section>

      {/* Recent users */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          Recent Users
        </h2>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
          <div className="grid grid-cols-[1fr_1fr_80px_80px_80px] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--gray-400)", background: "var(--gray-50)", fontFamily: "var(--font-display)" }}>
            <span>Username</span><span>Email</span><span>Role</span><span>Points</span><span>Status</span>
          </div>
          {recentUsers.map(u => (
            <div key={u.id} className="grid grid-cols-[1fr_1fr_80px_80px_80px] items-center px-5 py-3 text-sm"
              style={{ borderTop: "1px solid var(--gray-100)" }}>
              <Link href={`/profile/${u.username}`} className="font-semibold hover:text-[var(--neon-cyan)]" style={{ color: "var(--gray-800)", fontFamily: "var(--font-display)" }}>
                @{u.username}
              </Link>
              <span className="truncate" style={{ color: "var(--gray-500)" }}>{u.email}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-center"
                style={{
                  background: u.role === "admin" ? "var(--neon-pink-soft)" : "var(--gray-50)",
                  color: u.role === "admin" ? "var(--neon-pink)" : "var(--gray-500)",
                }}>
                {u.role}
              </span>
              <span className="text-xs font-bold text-center" style={{ color: "var(--neon-cyan)" }}>💎 {u.points}</span>
              <span className="text-xs text-center" style={{ color: u.status === "active" ? "#10B981" : "var(--gray-400)" }}>
                {u.status || "—"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
