import { TypePage } from "@/components/type-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Trivia Quizzes — Test Your Knowledge | Quizu",
  description: "Challenge yourself with trivia quizzes on science, history, movies, music, geography, and more. Can you score 100%?",
};

export default async function TriviaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <TypePage type="trivia" dbType="trivia" page={Math.max(1, parseInt(page || "1"))} />;
}
