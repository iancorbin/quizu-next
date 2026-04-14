import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--stone-900)", color: "var(--stone-500)" }}>
      <div className="accent-line-thin" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-10">
          <div>
            <Image src="/logo-quizu-inverse.png" alt="Quizu" width={90} height={26} className="h-6 w-auto opacity-60" />
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--stone-600)", maxWidth: "200px" }}>
              Personality quizzes, trivia, polls. Discover yourself.
            </p>
          </div>
          <div>
            <p className="mono text-[10px] font-bold tracking-wider mb-3" style={{ color: "var(--stone-600)" }}>QUIZZES</p>
            <div className="space-y-2 text-sm">
              <Link href="/personality" className="block hover:text-white transition-colors">Personality</Link>
              <Link href="/trivia" className="block hover:text-white transition-colors">Trivia</Link>
              <Link href="/polls" className="block hover:text-white transition-colors">Polls</Link>
              <Link href="/would-you-rather" className="block hover:text-white transition-colors">Would You Rather</Link>
            </div>
          </div>
          <div>
            <p className="mono text-[10px] font-bold tracking-wider mb-3" style={{ color: "var(--stone-600)" }}>TOPICS</p>
            <div className="space-y-2 text-sm">
              <Link href="/topic/personality" className="block hover:text-white transition-colors">Personality</Link>
              <Link href="/topic/entertainment" className="block hover:text-white transition-colors">Entertainment</Link>
              <Link href="/topic/science" className="block hover:text-white transition-colors">Science</Link>
              <Link href="/topic/music" className="block hover:text-white transition-colors">Music</Link>
            </div>
          </div>
          <div>
            <p className="mono text-[10px] font-bold tracking-wider mb-3" style={{ color: "var(--stone-600)" }}>MORE</p>
            <div className="space-y-2 text-sm">
              <Link href="/browse" className="block hover:text-white transition-colors">Browse All</Link>
              <Link href="/badges" className="block hover:text-white transition-colors">Badges</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid var(--stone-800)" }}>
          <p className="mono text-[10px]" style={{ color: "var(--stone-600)" }}>&copy; {new Date().getFullYear()} Quizu</p>
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--cyan)" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--pink)" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
