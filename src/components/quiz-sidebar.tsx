import Link from "next/link";

interface Props {
  quizType: string;
  quizAuthor: string;
  related: { id: number; title: string; url: string; type: string; taken: string }[];
}

export function QuizSidebar({ quizType, quizAuthor, related }: Props) {
  return (
    <aside className="hidden lg:block space-y-6">
      {/* Creator card */}
      <div className="game-card p-5">
        <p className="mono text-[10px] font-bold tracking-widest mb-3" style={{ color: "var(--gray-400)" }}>CREATED BY</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold display"
            style={{ background: "var(--grad-brand)", color: "white" }}>
            {quizAuthor.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link href={`/profile/${quizAuthor}`} className="display font-bold text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--gray-800)" }}>
              {quizAuthor}
            </Link>
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>Quiz Creator</p>
          </div>
        </div>
      </div>

      {/* Related quizzes */}
      {related.length > 0 && (
        <div className="game-card p-5">
          <p className="mono text-[10px] font-bold tracking-widest mb-4" style={{ color: "var(--gray-400)" }}>UP NEXT</p>
          <div className="space-y-2">
            {related.slice(0, 6).map((rq, i) => {
              const rankClass = i === 0 ? "rank-gold" : i === 1 ? "rank-silver" : i === 2 ? "rank-bronze" : "rank-default";
              return (
                <Link key={rq.id} href={`/${rq.url || rq.id}`}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[var(--gray-50)]">
                  <span className={`${rankClass} display w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="display text-xs font-semibold leading-snug line-clamp-2" style={{ color: "var(--gray-700)" }}>
                      {rq.title}
                    </p>
                    {Number(rq.taken) > 0 && (
                      <p className="mono text-[9px] mt-0.5" style={{ color: "var(--gray-400)" }}>{Number(rq.taken).toLocaleString()} played</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/browse" className="block mt-3 text-center display text-xs font-bold rounded-xl py-2 transition-all hover:bg-[var(--gray-50)]"
            style={{ color: "var(--cyan)" }}>
            Browse all quizzes
          </Link>
        </div>
      )}

      {/* Points CTA */}
      <div className="game-card p-5 text-center" style={{ background: "var(--gray-50)" }}>
        <p className="text-2xl mb-2">🎮</p>
        <p className="display text-sm font-bold" style={{ color: "var(--gray-800)" }}>Earn points</p>
        <p className="text-xs mt-1 mb-4" style={{ color: "var(--gray-400)" }}>
          +10 pts per quiz, +5 per comment
        </p>
        <Link href="/auth/signup" className="cta-btn w-full justify-center" style={{ padding: "8px 16px", fontSize: "12px" }}>
          <span>Join free</span>
        </Link>
      </div>
    </aside>
  );
}
