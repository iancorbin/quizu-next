"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  quizId: number;
  answers: {
    id: number;
    title: string;
    description: string;
    photo: string;
  }[];
}

export function WYRPlayer({ quizId, answers }: Props) {
  const [chosen, setChosen] = useState<number | null>(null);

  // WYR typically has 2 answers
  if (answers.length < 2) {
    return <p className="text-center text-gray-500">Not enough options.</p>;
  }

  const optionA = answers[0];
  const optionB = answers[1];

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <button
        onClick={() => setChosen(optionA.id)}
        className={cn(
          "flex-1 w-full rounded-xl border-2 p-6 text-center transition",
          chosen === null && "border-gray-200 hover:border-pink-400 hover:bg-pink-50",
          chosen === optionA.id && "border-pink-500 bg-pink-50",
          chosen !== null && chosen !== optionA.id && "opacity-50 border-gray-200"
        )}
      >
        {optionA.photo && (
          <img
            src={`/uploads/${optionA.photo}`}
            alt={optionA.title}
            className="mx-auto mb-3 h-32 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <h3 className="text-lg font-bold text-gray-900">{optionA.title}</h3>
        {optionA.description && (
          <p className="mt-1 text-sm text-gray-500">{optionA.description}</p>
        )}
      </button>

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
        OR
      </div>

      <button
        onClick={() => setChosen(optionB.id)}
        className={cn(
          "flex-1 w-full rounded-xl border-2 p-6 text-center transition",
          chosen === null && "border-gray-200 hover:border-pink-400 hover:bg-pink-50",
          chosen === optionB.id && "border-pink-500 bg-pink-50",
          chosen !== null && chosen !== optionB.id && "opacity-50 border-gray-200"
        )}
      >
        {optionB.photo && (
          <img
            src={`/uploads/${optionB.photo}`}
            alt={optionB.title}
            className="mx-auto mb-3 h-32 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <h3 className="text-lg font-bold text-gray-900">{optionB.title}</h3>
        {optionB.description && (
          <p className="mt-1 text-sm text-gray-500">{optionB.description}</p>
        )}
      </button>
    </div>
  );
}
