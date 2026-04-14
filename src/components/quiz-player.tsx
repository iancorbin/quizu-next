"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  title: string;
  image: string | null;
  options: {
    id: string;
    title: string;
    image: string | null;
    resultKey: string | null;
  }[];
}

interface QuizResultData {
  key: string;
  title: string;
  description: string | null;
  image: string | null;
}

interface QuizPlayerProps {
  quizId: string;
  quizTitle: string;
  questions: QuizQuestion[];
  results: QuizResultData[];
}

export function QuizPlayer({
  quizId,
  quizTitle,
  questions,
  results,
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + (result ? 1 : 0)) / questions.length) * 100;

  function selectOption(optionId: string) {
    if (result) return;

    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);

    if (isLast) {
      finishQuiz(newAnswers);
    } else {
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    }
  }

  async function finishQuiz(finalAnswers: Record<string, string>) {
    setSubmitting(true);

    // Tally result keys
    const tally: Record<string, number> = {};
    for (const [qId, optId] of Object.entries(finalAnswers)) {
      const q = questions.find((q) => q.id === qId);
      const opt = q?.options.find((o) => o.id === optId);
      if (opt?.resultKey) {
        tally[opt.resultKey] = (tally[opt.resultKey] || 0) + 1;
      }
    }

    const winningKey = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const matchedResult = results.find((r) => r.key === winningKey) || results[0];

    // Submit attempt to API
    try {
      await fetch(`/api/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          resultKey: matchedResult?.key,
        }),
      });
    } catch {
      // Non-critical — don't block the result
    }

    setResult(matchedResult || null);
    setSubmitting(false);
  }

  function restart() {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Result</h2>
        {result.image && (
          <img
            src={result.image}
            alt={result.title}
            className="mx-auto mt-4 max-h-64 rounded-xl"
          />
        )}
        <h3 className="mt-4 text-3xl font-bold text-indigo-600">
          {result.title}
        </h3>
        {result.description && (
          <p className="mt-2 text-gray-600">{result.description}</p>
        )}
        <button
          onClick={restart}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-2 text-sm text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>

      {question.image && (
        <img
          src={question.image}
          alt=""
          className="mt-3 max-h-48 rounded-xl"
        />
      )}

      <div className="mt-6 grid gap-3">
        {question.options.map((opt) => {
          const selected = answers[question.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => selectOption(opt.id)}
              disabled={submitting}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                selected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
              )}
            >
              {opt.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
