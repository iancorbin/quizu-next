"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Quizu
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/quiz"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Browse
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Create Quiz
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
