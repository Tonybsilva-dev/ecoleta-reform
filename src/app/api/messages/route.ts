import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getQuerySchema = z.object({
  userId: z.string().min(1, "userId é obrigatório"),
  with: z.enum(["received", "sent"]).default("received"),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const postBodySchema = z.object({
  senderId: z.string().min(1),
  recipientId: z.string().min(1),
  content: z.string().min(1).max(10_000),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = getQuerySchema.safeParse({
    userId: url.searchParams.get("userId"),
    with: (url.searchParams.get("with") as "received" | "sent") ?? undefined,
    limit: url.searchParams.get("limit"),
    offset: url.searchParams.get("offset"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { userId, with: scope, limit, offset } = parsed.data;

  if (scope === "received") {
    const data = await prisma.message.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
    return NextResponse.json({ data });
  }

  const data = await prisma.message.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = postBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { senderId, recipientId, content } = parsed.data;

  // Futuro: extrair senderId da sessão para segurança
  const created = await prisma.message.create({
    data: { senderId, recipientId, content },
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
