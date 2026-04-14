import { TypePage } from "@/components/type-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Polls — Cast Your Vote | Quizu",
  description: "Vote on polls about lifestyle, technology, travel, and more. See where the world stands on the debates that matter.",
};

export default async function PollsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <TypePage type="poll" dbType="poll" page={Math.max(1, parseInt(page || "1"))} />;
}
