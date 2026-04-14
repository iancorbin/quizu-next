"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--gray-400)" }}>
            Sign in to track your quiz results
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
            <input name="password" type="password" required
              className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--neon-cyan)] focus:shadow-[0_0_0_3px_var(--neon-cyan-glow)]"
              style={{ borderColor: "var(--gray-200)", color: "var(--gray-800)" }} />
          </div>

          <button type="submit" disabled={loading} className="cta-btn w-full justify-center disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--gray-400)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold hover:text-[var(--neon-cyan)] transition-colors" style={{ color: "var(--gray-700)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
