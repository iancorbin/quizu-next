"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface QuestionDraft {
  title: string;
  options: { title: string; resultKey: string }[];
}

interface ResultDraft {
  key: string;
  title: string;
  description: string;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0); // 0=details, 1=results, 2=questions
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Step 0: Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 1: Results
  const [results, setResults] = useState<ResultDraft[]>([
    { key: "A", title: "", description: "" },
    { key: "B", title: "", description: "" },
  ]);

  // Step 2: Questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      title: "",
      options: results.map((r) => ({ title: "", resultKey: r.key })),
    },
  ]);

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
        <p className="mt-2 text-gray-500">
          You need to be signed in to create a quiz.
        </p>
      </div>
    );
  }

  function addResult() {
    const nextKey = String.fromCharCode(65 + results.length); // A, B, C...
    setResults([...results, { key: nextKey, title: "", description: "" }]);
  }

  function removeResult(idx: number) {
    if (results.length <= 2) return;
    setResults(results.filter((_, i) => i !== idx));
  }

  function updateResult(idx: number, field: keyof ResultDraft, value: string) {
    const updated = [...results];
    updated[idx] = { ...updated[idx], [field]: value };
    setResults(updated);
  }

  function goToQuestions() {
    // Sync question options with current results
    const syncedQuestions = questions.map((q) => ({
      ...q,
      options: results.map((r) => {
        const existing = q.options.find((o) => o.resultKey === r.key);
        return existing || { title: "", resultKey: r.key };
      }),
    }));
    setQuestions(syncedQuestions);
    setStep(2);
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        title: "",
        options: results.map((r) => ({ title: "", resultKey: r.key })),
      },
    ]);
  }

  function removeQuestion(idx: number) {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  }

  function updateQuestionTitle(idx: number, value: string) {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], title: value };
    setQuestions(updated);
  }

  function updateOptionTitle(qIdx: number, oIdx: number, value: string) {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = {
      ...updated[qIdx].options[oIdx],
      title: value,
    };
    setQuestions(updated);
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, results, questions }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to create quiz");
      setSubmitting(false);
      return;
    }

    const { slug } = await res.json();
    router.push(`/quiz/${slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Create a Quiz</h1>

      {/* Step indicator */}
      <div className="mt-4 flex gap-2">
        {["Details", "Results", "Questions"].map((label, i) => (
          <button
            key={label}
            onClick={() => i < step && setStep(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              i === step
                ? "bg-indigo-600 text-white"
                : i < step
                  ? "bg-indigo-100 text-indigo-700 cursor-pointer"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 0: Details */}
      {step === 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quiz Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Which character are you?"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setStep(1)}
            disabled={!title.trim()}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Next: Define Results
          </button>
        </div>
      )}

      {/* Step 1: Results */}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            Define the possible outcomes. Each answer option will map to one of
            these results.
          </p>
          {results.map((r, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">
                  Result {r.key}
                </span>
                {results.length > 2 && (
                  <button
                    onClick={() => removeResult(i)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                value={r.title}
                onChange={(e) => updateResult(i, "title", e.target.value)}
                placeholder="Result title"
                className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <textarea
                value={r.description}
                onChange={(e) => updateResult(i, "description", e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={addResult}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            + Add another result
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={goToQuestions}
              disabled={results.some((r) => !r.title.trim())}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Next: Add Questions
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div className="mt-6 space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Question {qIdx + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIdx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                value={q.title}
                onChange={(e) => updateQuestionTitle(qIdx, e.target.value)}
                placeholder="What is your question?"
                className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-xs font-medium text-indigo-600">
                      → {results.find((r) => r.key === opt.resultKey)?.title || opt.resultKey}
                    </span>
                    <input
                      value={opt.title}
                      onChange={(e) =>
                        updateOptionTitle(qIdx, oIdx, e.target.value)
                      }
                      placeholder={`Option for result ${opt.resultKey}`}
                      className="block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            + Add another question
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                questions.some(
                  (q) =>
                    !q.title.trim() || q.options.some((o) => !o.title.trim())
                )
              }
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Quiz"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
