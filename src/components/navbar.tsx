"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV = [
  { href: "/personality", label: "Personality" },
  { href: "/trivia", label: "Trivia" },
  { href: "/polls", label: "Polls" },
  { href: "/badges", label: "Badges" },
  { href: "/browse", label: "Browse" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [pts, setPts] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/points/earn").then(r => r.json()).then(d => setPts(d.points)).catch(() => {});
    }
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl" style={{ borderBottom: "1px solid var(--gray-100)" }}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/logo-quizu.png" alt="Quizu" width={96} height={26} className="h-[26px] w-auto" priority />
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="display px-3 py-1.5 text-[13px] font-semibold transition-colors hover:text-[var(--gray-900)]"
              style={{ color: "var(--gray-400)" }}>
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              {pts !== null && (
                <span className="mono text-[11px] font-medium" style={{ color: "var(--cyan)" }}>
                  {pts.toLocaleString()} pts
                </span>
              )}
              <Link href={`/profile/${session.user.name}`}
                className="display text-[13px] font-semibold hover:text-[var(--gray-900)]"
                style={{ color: "var(--gray-500)" }}>
                {session.user.name}
              </Link>
              <button onClick={() => signOut()} className="text-[11px] font-medium hover:text-[var(--gray-700)]"
                style={{ color: "var(--gray-400)" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden sm:block display text-[13px] font-semibold hover:text-[var(--gray-900)]"
                style={{ color: "var(--gray-400)" }}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="cta-btn" style={{ padding: "7px 18px", fontSize: "12px" }}>
                <span>Join Quizu</span>
              </Link>
            </>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-1" style={{ color: "var(--gray-500)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 7h16"/><path d="M4 17h16"/></>}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 py-2" style={{ borderTop: "1px solid var(--gray-100)" }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="block display px-3 py-2 text-sm font-semibold hover:bg-[var(--gray-50)] rounded-lg"
              style={{ color: "var(--gray-600)" }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
