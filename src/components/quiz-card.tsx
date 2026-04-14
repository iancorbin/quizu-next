import Link from "next/link";

interface QuizCardProps {
  quiz: {
    slug: string;
    title: string;
    description: string | null;
    image: string | null;
    views: number;
    _count?: { questions: number };
    category?: { name: string; slug: string } | null;
    author?: { username: string } | null;
  };
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link
      href={`/quiz/${quiz.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100">
        {quiz.image && (
          <img
            src={quiz.image}
            alt={quiz.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {quiz.category && (
          <span className="mb-1 text-xs font-medium text-indigo-600">
            {quiz.category.name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {quiz.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-gray-400">
          {quiz._count && <span>{quiz._count.questions} questions</span>}
          <span>{quiz.views} views</span>
          {quiz.author && <span>by {quiz.author.username}</span>}
        </div>
      </div>
    </Link>
  );
}
