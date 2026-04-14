import { TypePage } from "@/components/type-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Would You Rather — Impossible Choices | Quizu",
  description: "Face impossible dilemmas in our Would You Rather quizzes. No good options — just choices that reveal who you really are.",
};

export default async function WouldYouRatherPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <TypePage type="vs" dbType="vs" page={Math.max(1, parseInt(page || "1"))} />;
}
