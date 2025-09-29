import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { GET, PUT } from "./route";

async function makeRequest(url: string, init?: RequestInit) {
  return new NextRequest(url, init as any);
}

// Mockar sessão ADMIN e default export esperado por auth.config
vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
  getServerSession: vi.fn(async () => ({
    user: { id: "admin-id", role: "ADMIN" },
  })),
}));

describe("/api/user (admin)", () => {
  let regularUserId: string;

  beforeEach(async () => {
    // Limpar
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar admin (role ADMIN via profile)
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: "hash",
      },
    });
    await prisma.profile.create({
      data: {
        userId: admin.id,
        name: "Admin",
        userType: "CITIZEN",
        role: "ADMIN",
      },
    });

    const user = await prisma.user.create({
      data: {
        name: "User One",
        email: "user1@example.com",
        password: "hash",
      },
    });
    await prisma.profile.create({
      data: { userId: user.id, name: "User One", userType: "CITIZEN" },
    });
    regularUserId = user.id;
  });

  afterEach(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should list users for admin with pagination", async () => {
    const req = await makeRequest(
      `http://localhost:3000/api/user?page=1&pageSize=10`,
      { method: "GET" },
    );

    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.pagination).toBeTruthy();
    expect(data.pagination.page).toBe(1);
  });

  it("should update role and isActive for a user (admin)", async () => {
    const body = JSON.stringify({
      userId: regularUserId,
      role: "OWNER",
      isActive: false,
    });
    const req = await makeRequest(`http://localhost:3000/api/user`, {
      method: "PUT",
      body,
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile.role).toBe("OWNER");
    expect(data.profile.isActive).toBe(false);
  });
});
