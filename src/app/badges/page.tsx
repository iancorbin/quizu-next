import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badges — Quizu",
  description: "Earn hilarious badges by taking quizzes, commenting, and climbing the ranks. From Baby Quizzer to Quiz God — how far can you go?",
};

const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"];
const rarityStyles: Record<string, { bg: string; border: string; text: string; glow: string; label: string }> = {
  common: { bg: "var(--gray-50)", border: "var(--gray-200)", text: "var(--gray-600)", glow: "none", label: "Common" },
  uncommon: { bg: "#E8FFF0", border: "#86EFAC", text: "#166534", glow: "none", label: "Uncommon" },
  rare: { bg: "var(--neon-cyan-soft)", border: "var(--neon-cyan)", text: "#0E7490", glow: "0 0 12px rgba(0,229,255,0.15)", label: "Rare" },
  epic: { bg: "#F3E8FF", border: "#A855F7", text: "#6B21A8", glow: "0 0 16px rgba(168,85,247,0.2)", label: "Epic" },
  legendary: { bg: "#FFF8E1", border: "#F59E0B", text: "#92400E", glow: "0 0 20px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.1)", label: "Legendary" },
};

export const dynamic = "force-dynamic";

export default async function BadgesPage() {
  const badges = await prisma.badge.findMany({
    include: { _count: { select: { earnedBy: true } } },
    orderBy: { id: "asc" },
  });

  const grouped = rarityOrder.map(rarity => ({
    rarity,
    style: rarityStyles[rarity],
    badges: badges.filter(b => b.rarity === rarity),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "var(--gray-400)" }}>
        <Link href="/" className="hover:text-[var(--neon-cyan)] transition-colors">Home</Link>
        <span>›</span>
        <span style={{ color: "var(--gray-600)" }}>Badges</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          🏆 Badge Collection
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--gray-500)" }}>
          Earn badges by taking quizzes, commenting, and being awesome. Some are easy. Some are legendary. All are ridiculous.
        </p>
      </div>

      {grouped.map(({ rarity, style, badges: rarityBadges }) => (
        <section key={rarity} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}`, fontFamily: "var(--font-display)" }}>
              {style.label}
            </span>
            <span className="text-xs" style={{ color: "var(--gray-400)" }}>
              {rarityBadges.length} badges
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rarityBadges.map(badge => (
              <div key={badge.id}
                className="rounded-2xl border-2 p-5 transition-all hover:-translate-y-1"
                style={{ borderColor: style.border, background: style.bg, boxShadow: style.glow }}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0">{badge.emoji}</span>
                  <div>
                    <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: style.text }}>
                      {badge.name}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--gray-600)" }}>
                      {badge.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(0,0,0,0.05)", color: "var(--gray-500)" }}>
                        {badge.requirement}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--gray-400)" }}>
                        {badge._count.earnedBy} earned
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
