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
      correct: string;
      photo: string;
    }[];
  }[];
}

export function TriviaPlayer({ quizId, questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return <p className="text-center text-gray-500">No questions available.</p>;
  }

  const q = questions[current];
  const progress = ((current + (finished ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(answerId: number, isCorrect: boolean) {
    if (selected !== null) return;
    setSelected(answerId);
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (current === questions.length - 1) {
        setFinished(true);
      } else {
        setCurrent((i) => i + 1);
        setSelected(null);
      }
    }, 1000);
  }

  function restart() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-500">Your Score</h2>
        <div className="mt-4 text-6xl font-bold text-indigo-600">
          {score}/{questions.length}
        </div>
        <p className="mt-2 text-gray-500">{pct}% correct</p>
        <button
          onClick={restart}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-1 text-sm text-gray-500">
        Question {current + 1} of {questions.length} — Score: {score}
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
        {q.answers.map((a) => {
          const isCorrect = a.correct === "A" || a.correct === "1";
          const isSelected = selected === a.id;
          return (
            <button
              key={a.id}
              onClick={() => selectAnswer(a.id, isCorrect)}
              disabled={selected !== null}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                selected === null && "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50",
                isSelected && isCorrect && "border-green-500 bg-green-50 text-green-700",
                isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                selected !== null && !isSelected && isCorrect && "border-green-300 bg-green-50/50",
                selected !== null && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              {a.answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}
