import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badges — Quizu",
  description: "Earn hilarious badges by taking quizzes, commenting, and climbing the ranks. From Baby Quizzer to Quiz God.",
};

const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"];
const rarityStyles: Record<string, { bg: string; border: string; text: string; glow: string; label: string }> = {
  common: { bg: "var(--gray-50)", border: "var(--gray-200)", text: "var(--gray-600)", glow: "none", label: "Common" },
  uncommon: { bg: "#E8FFF0", border: "#86EFAC", text: "#166534", glow: "none", label: "Uncommon" },
  rare: { bg: "var(--cyan-soft)", border: "var(--cyan)", text: "#0E7490", glow: "0 0 12px rgba(0,229,255,0.15)", label: "Rare" },
  epic: { bg: "#F3E8FF", border: "#A855F7", text: "#6B21A8", glow: "0 0 16px rgba(168,85,247,0.2)", label: "Epic" },
  legendary: { bg: "#FFF8E1", border: "#F59E0B", text: "#92400E", glow: "0 0 20px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.1)", label: "Legendary" },
};

export const dynamic = "force-dynamic";

export default async function BadgesPage() {
  const badges = await prisma.badge.findMany({ include: { _count: { select: { earnedBy: true } } }, orderBy: { id: "asc" } });
  const grouped = rarityOrder.map(r => ({ rarity: r, style: rarityStyles[r], badges: badges.filter(b => b.rarity === r) }));

  return (
    <div>
      {/* Compact header */}
      <div className="relative overflow-hidden" style={{ background: "var(--grad-game)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Badges</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Badge Collection</h1>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{badges.length} badges across 5 rarity tiers. All ridiculous.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {grouped.map(({ rarity, style, badges: rb }, gi) => (
          <section key={rarity} className={`mb-10 animate-rise d${Math.min(gi + 2, 6)}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="display rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                {style.label}
              </span>
              <span className="mono text-[11px]" style={{ color: "var(--gray-400)" }}>{rb.length} badges</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rb.map(badge => (
                <div key={badge.id} className="game-card p-5" style={{ borderColor: style.border, boxShadow: style.glow }}>
                  <div className="flex items-start gap-4">
                    <span className="text-4xl shrink-0">{badge.emoji}</span>
                    <div>
                      <h3 className="display font-bold text-sm" style={{ color: style.text }}>{badge.name}</h3>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--gray-500)" }}>{badge.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "var(--gray-50)", color: "var(--gray-500)" }}>
                          {badge.requirement}
                        </span>
                        <span className="mono text-[10px]" style={{ color: "var(--gray-400)" }}>{badge._count.earnedBy} earned</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
