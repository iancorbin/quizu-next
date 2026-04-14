import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = parseInt(id);
  if (isNaN(quizId)) return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { quizId, parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { username: true, photo: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        take: 10,
        include: {
          user: { select: { username: true, photo: true } },
        },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = parseInt(id);
  if (isNaN(quizId)) return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });

  const body = await req.json();
  const { message, authorName, parentId } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  const name = session?.user?.name || authorName || "Anonymous";

  const comment = await prisma.comment.create({
    data: {
      quizId,
      userId,
      authorName: name,
      message: message.trim().slice(0, 2000),
      parentId: parentId ? parseInt(parentId) : null,
    },
    include: {
      user: { select: { username: true, photo: true } },
      replies: true,
    },
  });

  // Award points for commenting if logged in
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 5 } },
    }).catch(() => {});
  }

  return NextResponse.json(comment, { status: 201 });
}
