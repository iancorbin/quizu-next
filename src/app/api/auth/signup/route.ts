import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const schema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = schema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return NextResponse.json({ error: `This ${field} is already taken` }, { status: 409 });
    }

    const hashed = await hash(password, 12);
    await prisma.user.create({
      data: {
        username, email, password: hashed,
        status: "active", timestamp: String(Date.now()),
        fbid: "", photo: "", zip: "", city: "", state: "",
        country: "", description: "", messaging: "", ip: "",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
