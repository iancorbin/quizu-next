"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      username: fd.get("username") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Sign up failed");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInRes?.error) {
      router.push("/auth/signin");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo-quizu.png" alt="Quizu" width={100} height={28} className="h-7 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--gray-900)" }}>
            Create your account
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--gray-400)" }}>
            Join Quizu to save your results and create quizzes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--neon-pink-soft)", color: "var(--neon-pink)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
              Username
            </label>
            <input name="username" type="text" required minLength={3} maxLength={30}
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_0_3px_var(--neon-cyan-glow)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-800)" }} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
              Email
            </label>
            <input name="email" type="email" required
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_0_3px_var(--neon-cyan-glow)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-800)" }} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--gray-400)", fontFamily: "var(--font-display)" }}>
              Password
            </label>
            <input name="password" type="password" required minLength={6}
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_0_3px_var(--neon-cyan-glow)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-800)" }} />
          </div>

          <button type="submit" disabled={loading} className="cta-btn w-full justify-center disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--gray-400)" }}>
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold hover:text-[var(--neon-cyan)] transition-colors" style={{ color: "var(--gray-700)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
