import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const body = await req.json();

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: id,
      userId: session?.user?.id || null,
      answers: body.answers,
      resultKey: body.resultKey || null,
    },
  });

  return NextResponse.json({ id: attempt.id }, { status: 201 });
}
