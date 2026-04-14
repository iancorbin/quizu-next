"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Props {
  quizId: number;
  quizTitle: string;
  questions: {
    id: number;
    question: string;
    photo: string;
    answers: { id: number; answer: string; resultId: number; photo: string }[];
  }[];
  results: { id: number; title: string; description: string; photo: string }[];
  relatedQuizzes?: { id: number; title: string; url: string; type: string; taken: string }[];
}

export function PersonalityPlayer({ quizId, quizTitle, questions, results, relatedQuizzes }: Props) {
  const [answers, setAnswers] = useState<Record<number, { answerId: number; resultId: number }>>({});
  const [result, setResult] = useState<Props["results"][0] | null>(null);
  const [showingResult, setShowingResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progress = (answeredCount / totalCount) * 100;
  const allAnswered = answeredCount === totalCount;

  function selectAnswer(questionId: number, answerId: number, resultId: number) {
    if (result) return;
    const newAnswers = { ...answers, [questionId]: { answerId, resultId } };
    setAnswers(newAnswers);

    // Find next unanswered question and scroll to it
    const answeredIds = new Set(Object.keys(newAnswers).map(Number));
    const nextQ = questions.find(q => !answeredIds.has(q.id));
    if (nextQ && questionRefs.current[nextQ.id]) {
      setTimeout(() => {
        questionRefs.current[nextQ.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }

    // Auto-submit when all answered
    if (Object.keys(newAnswers).length === totalCount) {
      setTimeout(() => computeResult(newAnswers), 600);
    }
  }

  function computeResult(finalAnswers: Record<number, { answerId: number; resultId: number }>) {
    const tally: Record<number, number> = {};
    for (const { resultId } of Object.values(finalAnswers)) {
      tally[resultId] = (tally[resultId] || 0) + 1;
    }
    const winnerId = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const matched = results.find(r => r.id === Number(winnerId)) || results[0];
    setResult(matched || null);
    setShowingResult(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setShowingResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (questions.length === 0) {
    return <div className="text-center py-12"><p className="text-4xl mb-3">🤔</p><p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>This quiz has no questions yet.</p></div>;
  }

  return (
    <div>
      {/* Sticky progress bar */}
      <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-md py-2 -mx-4 px-4 sm:-mx-6 sm:px-6" style={{ borderBottom: "1px solid var(--gray-100)" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-500)" }}>
            {answeredCount} of {totalCount} answered
          </span>
          {allAnswered && !result && (
            <button onClick={() => computeResult(answers)} className="cta-btn" style={{ padding: "6px 16px", fontSize: "12px" }}>
              See My Result →
            </button>
          )}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--gray-100)" }}>
          <div className="progress-neon h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* All questions */}
      <div className="mt-8 space-y-8">
        {questions.map((q, i) => {
          const selected = answers[q.id];
          const isAnswered = !!selected;

          return (
            <div
              key={q.id}
              ref={el => { questionRefs.current[q.id] = el; }}
              className="rounded-2xl border-2 p-6 transition-all duration-300"
              style={{
                borderColor: isAnswered ? "var(--neon-cyan)" : "var(--gray-100)",
                background: isAnswered ? "var(--neon-cyan-glow)" : "var(--white)",
                opacity: result && !isAnswered ? 0.4 : 1,
              }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                  style={{
                    background: isAnswered ? "var(--gradient-brand)" : "var(--gray-100)",
                    color: isAnswered ? "white" : "var(--gray-400)",
                    fontFamily: "var(--font-display)",
                  }}>
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
                  {q.question}
                </h3>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.answers.map(a => {
                  const isSelected = selected?.answerId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => selectAnswer(q.id, a.id, a.resultId)}
                      disabled={!!result}
                      className="rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all"
                      style={{
                        borderColor: isSelected ? "var(--neon-pink)" : "var(--gray-200)",
                        background: isSelected ? "var(--neon-pink-soft)" : "var(--white)",
                        color: "var(--gray-800)",
                        boxShadow: isSelected ? "0 0 0 3px var(--neon-pink-glow)" : "none",
                        cursor: result ? "default" : "pointer",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      {a.answer}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ RESULT ═══════════════════════════════════ */}
      {showingResult && result && (
        <div ref={resultRef} className="mt-12 rounded-3xl overflow-hidden" style={{ background: "var(--gray-900)" }}>
          {/* Decorative header */}
          <div className="neon-line-thin" />
          <div className="relative px-8 py-12 text-center overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: "var(--neon-cyan)" }} />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-[60px] opacity-15" style={{ background: "var(--neon-pink)" }} />

            <div className="relative">
              <span className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                Your Result
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gradient-vivid" style={{ fontFamily: "var(--font-display)" }}>
                {result.title}
              </h2>
              {result.description && (
                <p className="mt-4 text-base leading-relaxed max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {result.description}
                </p>
              )}

              {/* Share + actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `I got "${result.title}" on ${quizTitle}!`, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
                  style={{ background: "var(--gradient-brand)", color: "white", fontFamily: "var(--font-display)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share Result
                </button>
                <button onClick={restart}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)" }}>
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Related quizzes */}
          {relatedQuizzes && relatedQuizzes.length > 0 && (
            <div className="px-8 pb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}>
                You might also like
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {relatedQuizzes.slice(0, 4).map(rq => (
                  <Link key={rq.id} href={`/quiz/${rq.url || rq.id}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/5"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-xl">
                      {rq.type === "personality" || rq.type === "personalityalt" ? "✨" : rq.type === "trivia" ? "🧠" : "📊"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-display)" }}>
                        {rq.title}
                      </p>
                      {Number(rq.taken) > 0 && (
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{Number(rq.taken).toLocaleString()} taken</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
