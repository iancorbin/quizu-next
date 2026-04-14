"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  quizId: number;
  questions: {
    id: number;
    question: string;
    photo: string;
    answers: {
      id: number;
      answer: string;
      resultId: number;
      photo: string;
    }[];
  }[];
  results: {
    id: number;
    title: string;
    description: string;
    photo: string;
  }[];
}

export function PersonalityPlayer({ quizId, questions, results }: Props) {
  const [current, setCurrent] = useState(0);
  const [tally, setTally] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Props["results"][0] | null>(null);

  if (questions.length === 0) {
    return <p className="text-center text-gray-500">This quiz has no questions yet.</p>;
  }

  const q = questions[current];
  const progress = ((current + (result ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(resultId: number) {
    const newTally = { ...tally, [resultId]: (tally[resultId] || 0) + 1 };
    setTally(newTally);

    if (current === questions.length - 1) {
      // Find winning result
      const winnerId = Object.entries(newTally).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0];
      const matched =
        results.find((r) => r.id === Number(winnerId)) || results[0];
      setResult(matched || null);
    } else {
      setTimeout(() => setCurrent((i) => i + 1), 200);
    }
  }

  function restart() {
    setCurrent(0);
    setTally({});
    setResult(null);
  }

  if (result) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-500">Your Result</h2>
        {result.photo && (
          <img
            src={`/uploads/${result.photo}`}
            alt={result.title}
            className="mx-auto mt-4 max-h-64 rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
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
    <div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-2 text-sm text-gray-500">
        Question {current + 1} of {questions.length}
      </p>
      <h2 className="text-xl font-bold text-gray-900">{q.question}</h2>
      {q.photo && (
        <img
          src={`/uploads/${q.photo}`}
          alt=""
          className="mt-3 max-h-48 rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="mt-6 grid gap-3">
        {q.answers.map((a) => (
          <button
            key={a.id}
            onClick={() => selectAnswer(a.resultId)}
            className="rounded-xl border-2 border-gray-200 px-4 py-3 text-left text-sm font-medium transition hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            {a.answer}
          </button>
        ))}
      </div>
    </div>
  );
}
