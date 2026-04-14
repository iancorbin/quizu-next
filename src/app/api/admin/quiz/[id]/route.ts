import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) }, select: { role: true } });
  return user?.role === "admin";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  await prisma.quizMeta.update({ where: { id: parseInt(id) }, data: { published: body.published } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.quizMeta.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
