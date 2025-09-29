import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// GET /api/user - listar usuários (admin)
export async function GET(request: NextRequest) {
  // Mock para E2E: evita dependência de DB e auth
  if (process.env.E2E_TEST === "true") {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const q = (searchParams.get("q") ?? "").trim();

    // Cenários especiais para testes E2E
    if (q === "__error__") {
      return NextResponse.json({ error: "E2E forced error" }, { status: 500 });
    }

    const many = q === "__many__";
    const empty = q === "__empty__";
    const total = empty ? 0 : many ? 25 : 1;
    const users = empty
      ? []
      : many
        ? Array.from({ length: pageSize }, (_, i) => {
            const idx = (page - 1) * pageSize + i + 1;
            return {
              id: `u${idx}`,
              name: `User ${idx}`,
              email: `user${idx}@demo.com`,
              image: null,
              createdAt: new Date().toISOString(),
              profile: { role: "MEMBER", userType: "CITIZEN", isActive: true },
            };
          })
        : [
            {
              id: "u1",
              name: "Admin Demo",
              email: "admin@demo.com",
              image: null,
              createdAt: new Date().toISOString(),
              profile: { role: "ADMIN", userType: "CITIZEN", isActive: true },
            },
          ];
    return NextResponse.json({
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  }
  if (process.env.E2E_TEST !== "true") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
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
        // Cast para garantir build mesmo se o tipo gerado do Prisma ainda não incluir isActive
        profile: {
          select: { role: true, userType: true, isActive: true } as any,
        },
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
  // Mock para E2E: apenas ecoa a atualização solicitada
  if (process.env.E2E_TEST === "true") {
    const body = await request.json().catch(() => ({}));
    const { userId, role, isActive } = body as {
      userId: string;
      role?: "ADMIN" | "MEMBER" | "OWNER" | null;
      isActive?: boolean;
    };
    return NextResponse.json({
      success: true,
      profile: {
        userId: userId ?? "u1",
        role: role ?? "ADMIN",
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });
  }
  if (process.env.E2E_TEST !== "true") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
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
