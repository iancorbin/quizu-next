"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/browse?type=personality", label: "Personality" },
  { href: "/browse?type=trivia", label: "Trivia" },
  { href: "/browse?type=poll", label: "Polls" },
  { href: "/browse?type=list", label: "Lists" },
  { href: "/browse?type=vs", label: "vs" },
  { href: "/browse", label: "All" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md"
      style={{ borderColor: "var(--gray-100)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-quizu.png"
            alt="Quizu"
            width={110}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{ color: "var(--gray-600)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--neon-gradient-subtle)";
                e.currentTarget.style.color = "var(--gray-900)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--gray-600)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/browse"
            className="hidden sm:flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{
              background: "var(--neon-gradient)",
              boxShadow: "0 2px 12px rgba(0, 212, 255, 0.25)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            Explore
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--gray-600)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
              ) : (
                <><path d="M4 8h16"/><path d="M4 16h16"/></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: "var(--gray-100)" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: "var(--gray-700)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
