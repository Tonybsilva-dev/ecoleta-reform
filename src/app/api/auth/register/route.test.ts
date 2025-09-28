import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { POST } from "./route";

describe("POST /api/auth/register", () => {
  const validUserData = {
    name: "João Silva",
    email: "joao@example.com",
    password: "MinhaSenh@123",
    confirmPassword: "MinhaSenh@123",
  };

  beforeEach(async () => {
    // Limpar dados de teste antes de cada teste
    await prisma.profile.deleteMany({
      where: { user: { email: { contains: "example.com" } } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "example.com" } },
    });
  });

  afterEach(async () => {
    // Limpar dados de teste após cada teste
    await prisma.profile.deleteMany({
      where: { user: { email: { contains: "example.com" } } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "example.com" } },
    });
  });

  it("should create a new user and profile successfully", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Usuário criado com sucesso");
    expect(data.user).toMatchObject({
      name: "João Silva",
      email: "joao@example.com",
      userType: "CITIZEN",
    });
    expect(data.user.id).toBeDefined();
    expect(data.user.password).toBeUndefined(); // Senha não deve ser retornada

    // Verificar se o usuário foi criado no banco
    const user = await prisma.user.findUnique({
      where: { email: "joao@example.com" },
      include: { profile: true },
    });

    expect(user).toBeTruthy();
    expect(user?.name).toBe("João Silva");
    expect(user?.password).toBeDefined(); // Senha deve estar hasheada
    expect(user?.profile).toBeTruthy();
    expect(user?.profile?.userType).toBe("CITIZEN");
  });

  it("should reject duplicate email", async () => {
    // Criar usuário primeiro
    await prisma.user.create({
      data: {
        name: "Usuário Existente",
        email: "joao@example.com",
        password: "hashedpassword",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Email já está em uso");
    expect(data.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("should reject invalid data", async () => {
    const invalidData = {
      name: "",
      email: "invalid-email",
      password: "123",
      confirmPassword: "456",
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Dados inválidos");
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("should reject mismatched passwords", async () => {
    const mismatchedData = {
      ...validUserData,
      confirmPassword: "DifferentPassword@123",
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(mismatchedData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Dados inválidos");
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("should hash password correctly", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    // Verificar se a senha foi hasheada
    const user = await prisma.user.findUnique({
      where: { email: "joao@example.com" },
    });

    expect(user?.password).toBeDefined();
    expect(user?.password).not.toBe("MinhaSenh@123"); // Senha não deve estar em texto plano
    expect(user?.password?.length).toBeGreaterThan(50); // Hash bcrypt é longo
  });

  it("should create profile with correct userType", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const profile = await prisma.profile.findFirst({
      where: { user: { email: "joao@example.com" } },
    });

    expect(profile).toBeTruthy();
    expect(profile?.userType).toBe("CITIZEN");
    expect(profile?.name).toBe("João Silva");
  });
});
