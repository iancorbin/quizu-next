"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/browse?type=personality", label: "Personality", emoji: "✨" },
  { href: "/browse?type=trivia", label: "Trivia", emoji: "🧠" },
  { href: "/browse?type=poll", label: "Polls", emoji: "📊" },
  { href: "/browse", label: "All Quizzes" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/points/earn")
        .then((r) => r.json())
        .then((d) => setPoints(d.points))
        .catch(() => {});
    }
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg" style={{ borderBottom: "1px solid var(--gray-100)" }}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/logo-quizu.png" alt="Quizu" width={100} height={28} className="h-7 w-auto" priority />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-[var(--gray-50)]"
              style={{ color: "var(--gray-600)", fontFamily: "var(--font-display)" }}>
              {link.emoji && <span className="mr-1">{link.emoji}</span>}{link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* Points badge */}
              {points !== null && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: "var(--gradient-brand-subtle)", color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
                  💎 {points.toLocaleString()}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-medium" style={{ color: "var(--gray-500)" }}>
                {session.user.name || session.user.email}
              </span>
              <button onClick={() => signOut()} className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)]"
                style={{ borderColor: "var(--gray-200)", color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden sm:inline text-sm font-medium transition-colors hover:text-[var(--neon-cyan)]"
                style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="cta-btn" style={{ padding: "8px 20px", fontSize: "13px" }}>
                Sign up
              </Link>
            </>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden p-2" style={{ color: "var(--gray-500)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 8h16"/><path d="M4 16h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: "var(--gray-100)", background: "var(--white)" }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--gray-50)]"
              style={{ color: "var(--gray-700)", fontFamily: "var(--font-display)" }}>
              {link.emoji && <span className="mr-2">{link.emoji}</span>}{link.label}
            </Link>
          ))}
          {!session && (
            <Link href="/auth/signin" onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: "var(--gray-700)", fontFamily: "var(--font-display)" }}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
