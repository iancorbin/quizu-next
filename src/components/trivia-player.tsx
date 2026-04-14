"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Props {
  quizId: number;
  quizTitle?: string;
  questions: {
    id: number;
    question: string;
    photo: string;
    answers: { id: number; answer: string; correct: string; photo: string }[];
  }[];
  relatedQuizzes?: { id: number; title: string; url: string; type: string; taken: string }[];
}

export function TriviaPlayer({ quizId, quizTitle, questions, relatedQuizzes }: Props) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (questions.length === 0) {
    return <div className="text-center py-12"><p className="text-4xl mb-3">🧠</p><p style={{ color: "var(--gray-500)", fontFamily: "var(--font-display)" }}>No questions available.</p></div>;
  }

  const q = questions[current];
  const progress = ((current + (finished ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(answerId: number, isCorrect: boolean) {
    if (selected !== null) return;
    setSelected(answerId);

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setStreak(0);
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);
    }

    setTimeout(() => {
      if (current === questions.length - 1) {
        setFinished(true);
        // Earn points
        fetch("/api/points/earn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "quiz_complete", quizId }),
        }).catch(() => {});
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else {
        setCurrent(i => i + 1);
        setSelected(null);
      }
    }, 1500);
  }

  function restart() {
    setCurrent(0); setScore(0); setSelected(null); setFinished(false); setStreak(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Result ────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 90 ? "🏆" : pct >= 70 ? "🌟" : pct >= 50 ? "👍" : "📚";
    const gradeText = pct >= 90 ? "Outstanding!" : pct >= 70 ? "Great job!" : pct >= 50 ? "Not bad!" : "Keep studying!";

    return (
      <div ref={resultRef} className="rounded-3xl overflow-hidden" style={{ background: "var(--gray-900)" }}>
        <div className="neon-line-thin" />
        <div className="relative px-8 py-14 text-center overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20" style={{ background: pct >= 70 ? "var(--neon-cyan)" : "var(--neon-pink)" }} />

          <div className="relative">
            <div className="text-6xl mb-4">{grade}</div>
            <div className="text-6xl font-black text-gradient-vivid mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {score}/{questions.length}
            </div>
            <p className="text-xl font-bold mb-1" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-display)" }}>
              {gradeText}
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              You scored {pct}% — {pct >= 90 ? "you're a genius!" : pct >= 70 ? "impressive knowledge!" : pct >= 50 ? "above average!" : "room to grow!"}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={() => {
                if (navigator.share) navigator.share({ title: `I scored ${score}/${questions.length} on ${quizTitle || "this quiz"}!`, url: window.location.href });
                else navigator.clipboard.writeText(window.location.href);
              }} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
                style={{ background: "var(--gradient-brand)", color: "white", fontFamily: "var(--font-display)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share Score
              </button>
              <button onClick={restart}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)" }}>
                Try Again
              </button>
            </div>
          </div>
        </div>

        {relatedQuizzes && relatedQuizzes.length > 0 && (
          <div className="px-8 pb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}>
              Challenge yourself next
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {relatedQuizzes.slice(0, 4).map(rq => (
                <Link key={rq.id} href={`/${rq.url || rq.id}`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-xl">{rq.type === "trivia" ? "🧠" : "✨"}</span>
                  <p className="text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-display)" }}>{rq.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Question ──────────────────────────────────────
  return (
    <div className="relative">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
          {/* Particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-3 h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? "var(--neon-cyan)" : "var(--neon-pink)",
                top: "50%", left: "50%",
                animation: `confetti-particle 1s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${80 + Math.random() * 120}px)`,
                opacity: 0,
              }} />
          ))}
        </div>
      )}

      {/* Progress + score */}
      <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-md py-2 -mx-4 px-4 sm:-mx-6 sm:px-6" style={{ borderBottom: "1px solid var(--gray-100)" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-500)" }}>
            Question {current + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <span className="text-xs font-bold animate-pulse" style={{ color: "var(--neon-pink)", fontFamily: "var(--font-display)" }}>
                🔥 {streak} streak!
              </span>
            )}
            <span className="text-sm font-black" style={{ fontFamily: "var(--font-display)", color: "var(--neon-cyan)" }}>
              {score}/{questions.length}
            </span>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--gray-100)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "var(--neon-cyan)", boxShadow: "0 0 12px rgba(0,229,255,0.35)" }} />
        </div>
      </div>

      <div className={`mt-8 ${showShake ? "animate-shake" : ""}`}>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          {q.question}
        </h2>
        {q.photo && <img src={`/uploads/${q.photo}`} alt="" className="mt-4 max-h-48 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.answers.map(a => {
            const isCorrect = a.correct === "A" || a.correct === "1";
            const isSelected = selected === a.id;
            const showResult = selected !== null;

            let bg = "var(--white)";
            let border = "var(--gray-200)";
            let shadow = "none";
            let scale = "scale(1)";

            if (showResult && isSelected && isCorrect) {
              bg = "#ECFDF5"; border = "#10B981"; shadow = "0 0 0 3px rgba(16,185,129,0.15), 0 0 20px rgba(16,185,129,0.1)"; scale = "scale(1.02)";
            } else if (showResult && isSelected && !isCorrect) {
              bg = "#FEF2F2"; border = "#EF4444"; shadow = "0 0 0 3px rgba(239,68,68,0.15)"; scale = "scale(0.98)";
            } else if (showResult && !isSelected && isCorrect) {
              bg = "#ECFDF5"; border = "#10B981"; shadow = "0 0 0 2px rgba(16,185,129,0.1)";
            }

            return (
              <button key={a.id} onClick={() => selectAnswer(a.id, isCorrect)} disabled={selected !== null}
                className="rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-300"
                style={{
                  borderColor: border, background: bg, boxShadow: shadow, transform: scale,
                  color: "var(--gray-800)", cursor: showResult ? "default" : "pointer",
                  opacity: showResult && !isSelected && !isCorrect ? 0.4 : 1,
                }}>
                <span className="flex items-center justify-between gap-2">
                  <span>{a.answer}</span>
                  {showResult && isSelected && isCorrect && <span className="text-lg">✅</span>}
                  {showResult && isSelected && !isCorrect && <span className="text-lg">❌</span>}
                  {showResult && !isSelected && isCorrect && <span className="text-xs font-bold" style={{ color: "#10B981" }}>✓ Correct</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti-particle {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% - 200px)) scale(0.5); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
