import { TypePage } from "@/components/type-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Personality Quizzes — Find Out Who You Really Are | Quizu",
  description: "Take free personality quizzes that reveal your hidden traits, love language, intelligence type, and more. Thousands of personality tests to discover yourself.",
};

export default async function PersonalityPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <TypePage type="personality" dbType={["personality", "personalityalt"]} page={Math.max(1, parseInt(page || "1"))} />;
}
