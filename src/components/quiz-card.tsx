import Link from "next/link";

const typeColors: Record<string, string> = {
  personality: "bg-purple-100 text-purple-700",
  personalityalt: "bg-purple-100 text-purple-700",
  trivia: "bg-blue-100 text-blue-700",
  poll: "bg-green-100 text-green-700",
  list: "bg-yellow-100 text-yellow-700",
  question: "bg-orange-100 text-orange-700",
  vs: "bg-pink-100 text-pink-700",
};

const typeLabels: Record<string, string> = {
  personality: "Personality",
  personalityalt: "Personality",
  trivia: "Trivia",
  poll: "Poll",
  list: "List",
  question: "Question",
  vs: "Would You Rather",
};

interface QuizCardProps {
  quiz: {
    id: number;
    title: string;
    description: string;
    photo: string;
    type: string;
    url: string;
    views: string;
    taken: string;
    category: string;
    username: string;
  };
}

export function QuizCard({ quiz }: QuizCardProps) {
  const slug = quiz.url || quiz.id.toString();
  const typeColor = typeColors[quiz.type] || "bg-gray-100 text-gray-700";
  const typeLabel = typeLabels[quiz.type] || quiz.type;

  return (
    <Link
      href={`/quiz/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative">
        {quiz.photo && quiz.photo !== "" && (
          <img
            src={`/uploads/${quiz.photo}`}
            alt={quiz.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold ${typeColor}`}
        >
          {typeLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2">
          {quiz.title}
        </h3>
        {quiz.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {quiz.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-gray-400">
          {quiz.taken && quiz.taken !== "0" && quiz.taken !== "" && (
            <span>{Number(quiz.taken).toLocaleString()} taken</span>
          )}
          {quiz.views && quiz.views !== "0" && quiz.views !== "" && (
            <span>{Number(quiz.views).toLocaleString()} views</span>
          )}
          {quiz.category && <span className="capitalize">{quiz.category}</span>}
        </div>
      </div>
    </Link>
  );
}
