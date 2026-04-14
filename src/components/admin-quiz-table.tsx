"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Quiz {
  id: number; title: string; type: string; published: string;
  username: string; views: string; taken: string; url: string;
}

export function AdminQuizTable({ quizzes }: { quizzes: Quiz[] }) {
  const router = useRouter();

  async function togglePublish(quizId: number, currentStatus: string) {
    const newStatus = currentStatus === "2" ? "1" : "2";
    await fetch(`/api/admin/quiz/${quizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: newStatus }),
    });
    router.refresh();
  }

  async function deleteQuiz(quizId: number) {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    await fetch(`/api/admin/quiz/${quizId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--gray-100)" }}>
      <div className="grid grid-cols-[1fr_80px_80px_70px_70px_120px] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--gray-400)", background: "var(--gray-50)", fontFamily: "var(--font-display)" }}>
        <span>Title</span><span>Type</span><span>Status</span><span>Views</span><span>Taken</span><span>Actions</span>
      </div>
      {quizzes.map(q => (
        <div key={q.id} className="grid grid-cols-[1fr_80px_80px_70px_70px_120px] items-center px-5 py-3 text-sm"
          style={{ borderTop: "1px solid var(--gray-100)" }}>
          <Link href={`/${q.url || q.id}`} className="font-semibold truncate pr-4 hover:text-[var(--neon-cyan)]"
            style={{ color: "var(--gray-800)", fontFamily: "var(--font-display)" }}>
            {q.title}
          </Link>
          <span className={`badge badge-${q.type}`} style={{ fontSize: "10px" }}>{q.type}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-center"
            style={{
              background: q.published === "2" ? "#E8FFF0" : "#FFF0E5",
              color: q.published === "2" ? "#0A7544" : "#B34500",
            }}>
            {q.published === "2" ? "Live" : "Draft"}
          </span>
          <span className="text-xs tabular-nums text-center" style={{ color: "var(--gray-400)" }}>
            {Number(q.views) || 0}
          </span>
          <span className="text-xs tabular-nums text-center" style={{ color: "var(--gray-400)" }}>
            {Number(q.taken) || 0}
          </span>
          <div className="flex gap-1">
            <button onClick={() => togglePublish(q.id, q.published)}
              className="rounded-lg px-2 py-1 text-[10px] font-bold transition-all hover:opacity-80"
              style={{
                background: q.published === "2" ? "#FFF0E5" : "#E8FFF0",
                color: q.published === "2" ? "#B34500" : "#0A7544",
              }}>
              {q.published === "2" ? "Unpublish" : "Publish"}
            </button>
            <button onClick={() => deleteQuiz(q.id)}
              className="rounded-lg px-2 py-1 text-[10px] font-bold transition-all hover:opacity-80"
              style={{ background: "#FEF2F2", color: "#DC2626" }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
