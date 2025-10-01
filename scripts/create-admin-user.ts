import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.profile.findFirst({
      where: { role: "ADMIN" },
      include: { user: true },
    });

    if (existingAdmin) {
      console.log("✅ Usuário admin já existe:", existingAdmin.user.email);
      return;
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@sustainable.com",
        name: "Administrador",
        password: hashedPassword,
      },
    });

    // Criar perfil admin
    await prisma.profile.create({
      data: {
        userId: adminUser.id,
        name: "Administrador",
        userType: "CITIZEN", // Tipo base, mas role é ADMIN
        role: "ADMIN",
        hasSelectedRole: true,
      },
    });

    console.log("✅ Usuário admin criado com sucesso!");
    console.log("📧 Email: admin@sustainable.com");
    console.log("🔑 Senha: admin123");
    console.log("👤 Role: ADMIN");
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
