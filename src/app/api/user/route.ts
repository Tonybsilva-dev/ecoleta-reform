import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// GET /api/user - listar usuários (admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const query = (searchParams.get("q") ?? "").trim();

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { name: { contains: query, mode: "insensitive" as const } },
          {
            profile: {
              name: { contains: query, mode: "insensitive" as const },
            },
          },
        ],
      }
    : undefined;

  const countPromise = where
    ? prisma.user.count({ where })
    : prisma.user.count();

  const [total, users] = await Promise.all([
    countPromise,
    prisma.user.findMany({
      ...(where ? { where } : {}),
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        profile: { select: { role: true, userType: true, isActive: true } },
      },
    }),
  ]);

  return NextResponse.json({
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// PUT /api/user - atualizar role/isActive (admin)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, role, isActive } = body as {
    userId: string;
    role?: "ADMIN" | "MEMBER" | "OWNER" | null;
    isActive?: boolean;
  };

  if (!userId) {
    return NextResponse.json(
      { error: "userId é obrigatório" },
      { status: 400 },
    );
  }

  // Garante existência de profile
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    await prisma.profile.create({
      data: { userId, name: "Usuário", userType: "CITIZEN" },
    });
  }

  const updated = await prisma.profile.update({
    where: { userId },
    data: {
      ...(role !== undefined ? { role: { set: role ?? null } } : {}),
      ...(typeof isActive === "boolean" ? { isActive: { set: isActive } } : {}),
    },
    select: { userId: true, role: true, isActive: true },
  });

  return NextResponse.json({ success: true, profile: updated });
}
