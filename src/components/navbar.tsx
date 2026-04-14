"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/browse", label: "Explore" },
  { href: "/browse?type=personality", label: "Personality" },
  { href: "/browse?type=trivia", label: "Trivia" },
  { href: "/badges", label: "Badges" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/points/earn").then(r => r.json()).then(d => setPoints(d.points)).catch(() => {});
    }
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg" style={{ borderBottom: "1px solid var(--gray-100)" }}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/logo-quizu.png" alt="Quizu" width={100} height={28} className="h-7 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors hover:bg-gray-50 hover:text-gray-900"
              style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {session ? (
            <>
              {points !== null && (
                <span className="hidden sm:inline text-xs font-bold tabular-nums" style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
                  {points.toLocaleString()} pts
                </span>
              )}
              <Link href={`/profile/${session.user.name}`} className="hidden sm:inline text-[13px] font-semibold hover:text-gray-900 transition-colors"
                style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
                {session.user.name}
              </Link>
              <button onClick={() => signOut()} className="text-xs font-medium transition-colors hover:text-gray-700"
                style={{ color: "var(--gray-400)" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden sm:inline text-[13px] font-semibold transition-colors hover:text-gray-900"
                style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="cta-btn" style={{ padding: "7px 18px", fontSize: "12px" }}>
                Sign up
              </Link>
            </>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden p-1.5" style={{ color: "var(--gray-500)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 8h16"/><path d="M4 16h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden border-t px-4 py-2" style={{ borderColor: "var(--gray-100)" }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
              style={{ color: "var(--gray-700)", fontFamily: "var(--font-display)" }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
