"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CommentData {
  id: number;
  authorName: string;
  message: string;
  createdAt: string;
  user: { username: string; photo: string } | null;
  replies: {
    id: number;
    authorName: string;
    message: string;
    createdAt: string;
    user: { username: string; photo: string } | null;
  }[];
}

interface Props {
  quizId: number;
  initialCount: number;
}

export function CommentSection({ quizId, initialCount }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${quizId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quizId]);

  async function submitComment(parentId?: number) {
    const msg = parentId ? replyMessage : message;
    if (!msg.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/quiz/${quizId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        authorName: session?.user?.name || name || "Anonymous",
        parentId: parentId || null,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, newComment] }
              : c
          )
        );
        setReplyMessage("");
        setReplyingTo(null);
      } else {
        setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
        setMessage("");
      }
    }
    setSubmitting(false);
  }

  function timeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  }

  const totalComments = comments.length + comments.reduce((s, c) => s + c.replies.length, 0);

  return (
    <div className="mt-12">
      <div className="neon-line-thin w-full mb-8" />

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
          Comments
        </h2>
        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: "var(--neon-cyan-soft)", color: "var(--neon-cyan)", fontFamily: "var(--font-display)" }}>
          {totalComments || initialCount}
        </span>
      </div>

      {/* Add comment form */}
      <div className="rounded-2xl border p-4 mb-6" style={{ borderColor: "var(--gray-100)" }}>
        {!session && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-xl border-2 px-4 py-2.5 text-sm mb-3 outline-none transition-all focus:border-[var(--neon-cyan)]"
            style={{ borderColor: "var(--gray-200)" }}
          />
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={session ? "Share your thoughts..." : "Add a comment..."}
          rows={3}
          className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--neon-cyan)] resize-none"
          style={{ borderColor: "var(--gray-200)" }}
        />
        <div className="flex items-center justify-between mt-3">
          {!session && (
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              <Link href="/auth/signin" className="font-semibold hover:text-[var(--neon-cyan)]" style={{ color: "var(--gray-600)" }}>
                Sign in
              </Link>{" "}to earn 5 points per comment
            </p>
          )}
          {session && (
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              Posting as <strong style={{ color: "var(--gray-700)" }}>{session.user.name}</strong> · +5 points
            </p>
          )}
          <button
            onClick={() => submitComment()}
            disabled={!message.trim() || submitting}
            className="cta-btn disabled:opacity-40"
            style={{ padding: "8px 20px", fontSize: "13px" }}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: "var(--gray-400)" }}>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm font-medium" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
            No comments yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id}>
              {/* Parent comment */}
              <div className="rounded-xl p-4" style={{ background: "var(--gray-50)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--gradient-brand)", color: "white" }}>
                    {(c.user?.username || c.authorName || "A").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-800)" }}>
                    {c.user?.username || c.authorName || "Anonymous"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--gray-400)" }}>
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray-700)" }}>
                  {c.message}
                </p>
                <button
                  onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                  className="mt-2 text-xs font-semibold transition-colors hover:text-[var(--neon-cyan)]"
                  style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}
                >
                  Reply
                </button>
              </div>

              {/* Replies */}
              {c.replies.length > 0 && (
                <div className="ml-8 mt-2 space-y-2">
                  {c.replies.map((r) => (
                    <div key={r.id} className="rounded-xl p-3" style={{ background: "var(--gray-50)", borderLeft: "3px solid var(--neon-cyan)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-700)" }}>
                          {r.user?.username || r.authorName || "Anonymous"}
                        </span>
                        <span className="text-xs" style={{ color: "var(--gray-400)" }}>{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--gray-600)" }}>{r.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === c.id && (
                <div className="ml-8 mt-2 flex gap-2">
                  <input
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 rounded-xl border-2 px-3 py-2 text-sm outline-none transition-all focus:border-[var(--neon-cyan)]"
                    style={{ borderColor: "var(--gray-200)" }}
                    onKeyDown={(e) => e.key === "Enter" && submitComment(c.id)}
                  />
                  <button onClick={() => submitComment(c.id)} disabled={!replyMessage.trim() || submitting}
                    className="cta-btn disabled:opacity-40" style={{ padding: "8px 16px", fontSize: "12px" }}>
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
