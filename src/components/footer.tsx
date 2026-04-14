import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--gray-900)", color: "rgba(255,255,255,0.4)" }}>
      {/* Top gradient line */}
      <div className="neon-line-thin" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <Image src="/logo-quizu-inverse.png" alt="Quizu" width={90} height={26} className="h-6 w-auto opacity-70" />
            <p className="mt-3 text-xs leading-relaxed" style={{ maxWidth: "200px" }}>
              The home of personality quizzes, trivia, polls, and more. Discover yourself.
            </p>
          </div>

          {/* Quiz Types */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-display)" }}>Quizzes</p>
            <div className="space-y-2 text-sm">
              <Link href="/browse?type=personality" className="block hover:text-[var(--neon-pink)] transition-colors">✨ Personality</Link>
              <Link href="/browse?type=trivia" className="block hover:text-[var(--neon-cyan)] transition-colors">🧠 Trivia</Link>
              <Link href="/browse?type=poll" className="block hover:text-[var(--neon-cyan)] transition-colors">📊 Polls</Link>
              <Link href="/browse?type=list" className="block hover:text-[var(--neon-cyan)] transition-colors">📝 Lists</Link>
              <Link href="/browse?type=vs" className="block hover:text-[var(--neon-pink)] transition-colors">⚡ Would You Rather</Link>
            </div>
          </div>

          {/* Topics */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-display)" }}>Topics</p>
            <div className="space-y-2 text-sm">
              <Link href="/topic/personality" className="block hover:text-white transition-colors">Personality</Link>
              <Link href="/topic/entertainment" className="block hover:text-white transition-colors">Entertainment</Link>
              <Link href="/topic/popculture" className="block hover:text-white transition-colors">Pop Culture</Link>
              <Link href="/topic/science" className="block hover:text-white transition-colors">Science</Link>
              <Link href="/topic/music" className="block hover:text-white transition-colors">Music</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-display)" }}>Company</p>
            <div className="space-y-2 text-sm">
              <Link href="/browse" className="block hover:text-white transition-colors">Browse All</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs">&copy; {new Date().getFullYear()} Quizu</p>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-cyan)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-pink)" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
