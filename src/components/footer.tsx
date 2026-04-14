import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-16" style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <Image src="/logo-quizu.png" alt="Quizu" width={100} height={28} className="h-7 w-auto opacity-60" />
            <p className="mt-3 text-sm max-w-xs" style={{ color: "var(--gray-400)", fontFamily: "var(--font-body)" }}>
              The home of personality quizzes, trivia, polls, and more.
              Discover yourself.
            </p>
          </div>
          <div className="flex gap-12 text-sm" style={{ color: "var(--gray-500)" }}>
            <div className="space-y-2">
              <p className="font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>Browse</p>
              <Link href="/browse?type=personality" className="block hover:text-[var(--neon-pink)] transition-colors">Personality</Link>
              <Link href="/browse?type=trivia" className="block hover:text-[var(--neon-blue)] transition-colors">Trivia</Link>
              <Link href="/browse?type=poll" className="block hover:text-[var(--neon-blue)] transition-colors">Polls</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>More</p>
              <Link href="/browse?type=list" className="block hover:text-[var(--neon-blue)] transition-colors">Lists</Link>
              <Link href="/browse?type=vs" className="block hover:text-[var(--neon-pink)] transition-colors">Would You Rather</Link>
              <Link href="/browse" className="block hover:text-[var(--neon-blue)] transition-colors">All Quizzes</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: "var(--gray-200)" }}>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>
            &copy; {new Date().getFullYear()} Quizu. All rights reserved.
          </p>
          <div className="flex gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--neon-blue)" }} />
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--neon-pink)" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
