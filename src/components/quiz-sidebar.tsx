import Link from "next/link";

const typeEmoji: Record<string, string> = {
  personality: "✨", personalityalt: "✨", trivia: "🧠", poll: "📊", list: "📝", question: "❓", vs: "⚡",
};

interface Props {
  quizType: string;
  quizAuthor: string;
  related: { id: number; title: string; url: string; type: string; taken: string }[];
}

export function QuizSidebar({ quizType, quizAuthor, related }: Props) {
  return (
    <aside className="hidden lg:block space-y-6">
      {/* Creator card */}
      <div className="rounded-2xl border p-5" style={{ borderColor: "var(--gray-100)" }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
          Created by
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--gradient-brand)", color: "white", fontFamily: "var(--font-display)" }}>
            {quizAuthor.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
              {quizAuthor}
            </p>
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>Quiz Creator</p>
          </div>
        </div>
      </div>

      {/* Related quizzes */}
      {related.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--gray-100)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
            Related Quizzes
          </p>
          <div className="space-y-2">
            {related.slice(0, 6).map((rq, i) => (
              <Link key={rq.id} href={`/${rq.url || rq.id}`}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-[var(--gray-50)]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    background: i < 3 ? "var(--gradient-brand)" : "var(--gray-100)",
                    color: i < 3 ? "white" : "var(--gray-400)",
                    fontFamily: "var(--font-display)",
                  }}>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "var(--gray-700)", fontFamily: "var(--font-display)" }}>
                    {rq.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>
                    {typeEmoji[rq.type] || "📋"} {Number(rq.taken) > 0 ? `${Number(rq.taken).toLocaleString()} taken` : rq.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/browse" className="block mt-3 text-center text-xs font-bold rounded-xl py-2 transition-all hover:bg-[var(--gray-50)]"
            style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
            Browse All Quizzes →
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl p-5 text-center" style={{ background: "var(--gradient-brand-subtle)", border: "1px solid var(--gray-100)" }}>
        <p className="text-2xl mb-2">🎯</p>
        <p className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
          Want more?
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--gray-500)" }}>
          Explore thousands of quizzes
        </p>
        <Link href="/browse" className="cta-btn w-full justify-center" style={{ padding: "10px 20px", fontSize: "13px" }}>
          Explore Quizzes
        </Link>
      </div>
    </aside>
  );
}
