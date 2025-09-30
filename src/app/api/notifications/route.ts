import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getQuerySchema = z.object({
  userId: z.string().min(1, "userId é obrigatório"),
  isRead: z
    .union([z.literal("true"), z.literal("false"), z.null()])
    .transform((v) => (v === null ? undefined : v === "true"))
    .optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const postBodySchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(255),
  body: z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = getQuerySchema.safeParse({
    userId: url.searchParams.get("userId"),
    isRead: (url.searchParams.get("isRead") as "true" | "false" | null) ?? null,
    limit: url.searchParams.get("limit"),
    offset: url.searchParams.get("offset"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { userId, isRead, limit, offset } = parsed.data;

  const data = await prisma.notification.findMany({
    where: { userId, ...(isRead === undefined ? {} : { isRead }) },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = postBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { userId, title, body } = parsed.data;

  const created = await prisma.notification.create({
    data: { userId, title, body },
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
