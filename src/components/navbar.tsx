import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Quizu
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/browse"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Browse
          </Link>
          <Link
            href="/browse?type=personality"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Personality
          </Link>
          <Link
            href="/browse?type=trivia"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Trivia
          </Link>
          <Link
            href="/browse?type=poll"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Polls
          </Link>
        </div>
      </div>
    </nav>
  );
}
