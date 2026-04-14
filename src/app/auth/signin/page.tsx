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
    setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: fd.get("email"), password: fd.get("password"), redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); }
    else { router.push("/"); router.refresh(); }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" style={{ background: "var(--grad-game)" }}>
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-20 left-[20%] w-48 h-48 rounded-full blur-[80px] opacity-20 float" style={{ background: "var(--cyan)" }} />
      <div className="absolute bottom-20 right-[20%] w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "var(--pink)" }} />

      <div className="relative w-full max-w-sm px-4 animate-rise">
        <div className="game-card p-8" style={{ background: "var(--white)" }}>
          <div className="text-center mb-8">
            <Image src="/logo-quizu.png" alt="Quizu" width={100} height={28} className="h-7 w-auto mx-auto mb-4" />
            <h1 className="display text-2xl font-extrabold" style={{ color: "var(--gray-900)" }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: "var(--gray-400)" }}>Sign in to track your results and earn points</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--pink-10)", color: "var(--pink)" }}>{error}</div>
            )}
            <div>
              <label className="mono text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--gray-400)" }}>EMAIL</label>
              <input name="email" type="email" required
                className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_var(--cyan-10)]"
                style={{ borderColor: "var(--gray-200)" }} />
            </div>
            <div>
              <label className="mono text-[10px] font-bold tracking-widest mb-1.5 block" style={{ color: "var(--gray-400)" }}>PASSWORD</label>
              <input name="password" type="password" required
                className="w-full rounded-xl border-2 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_var(--cyan-10)]"
                style={{ borderColor: "var(--gray-200)" }} />
            </div>
            <button type="submit" disabled={loading} className="cta-btn w-full justify-center disabled:opacity-50">
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
          <p className="mt-6 text-center text-sm" style={{ color: "var(--gray-400)" }}>
            Don&apos;t have an account? <Link href="/auth/signup" className="display font-bold hover:text-[var(--cyan)]" style={{ color: "var(--gray-700)" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
