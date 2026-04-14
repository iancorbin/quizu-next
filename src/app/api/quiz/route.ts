import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const quizzes = await prisma.quiz.findMany({
    where: {
      status: "published",
      ...(category ? { category: { slug: category } } : {}),
    },
    include: {
      category: true,
      author: { select: { username: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, results, questions } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!results?.length || results.length < 2) {
    return NextResponse.json(
      { error: "At least 2 results required" },
      { status: 400 }
    );
  }
  if (!questions?.length) {
    return NextResponse.json(
      { error: "At least 1 question required" },
      { status: 400 }
    );
  }

  // Generate unique slug
  let slug = slugify(title);
  const existing = await prisma.quiz.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      slug,
      description: description || null,
      authorId: session.user.id,
      status: "published",
      results: {
        create: results.map(
          (r: { key: string; title: string; description?: string }) => ({
            key: r.key,
            title: r.title,
            description: r.description || null,
          })
        ),
      },
      questions: {
        create: questions.map(
          (
            q: {
              title: string;
              options: { title: string; resultKey: string }[];
            },
            idx: number
          ) => ({
            title: q.title,
            order: idx,
            options: {
              create: q.options.map(
                (o: { title: string; resultKey: string }) => ({
                  title: o.title,
                  resultKey: o.resultKey,
                })
              ),
            },
          })
        ),
      },
    },
  });

  return NextResponse.json({ id: quiz.id, slug: quiz.slug }, { status: 201 });
}
