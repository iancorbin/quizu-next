import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const body = await req.json();
  const { type, quizId } = body;

  let points = 0;
  if (type === "quiz_complete") points = 10;
  else if (type === "comment") points = 5;
  else if (type === "share") points = 3;
  else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: points } },
    select: { points: true },
  });

  return NextResponse.json({ points: user.points, earned: points });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ points: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: { points: true },
  });

  return NextResponse.json({ points: user?.points || 0 });
}
