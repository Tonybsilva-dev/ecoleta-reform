import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { deleteUploadThingFiles } from "@/lib/uploadthing";
import { updateItemSchema } from "@/lib/validations/item.schema";

// Schemas para endpoints específicos
const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SOLD", "DONATED", "COLLECTED"]),
});

const updateTransactionTypeSchema = z.object({
  transactionType: z.enum(["SALE", "DONATION", "COLLECTION"]),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        createdBy: { include: { profile: true } },
        organization: true,
        material: { include: { category: true } },
        images: true,
        orders: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// PUT /api/items/[id] - Atualizar item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se o item existe
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o criador do item ou admin
    if (existingItem.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Você só pode editar seus próprios itens" },
        { status: 403 },
      );
    }

    // Validar dados de entrada
    const body = await request.json();
    const validatedData = updateItemSchema.parse({ ...body, id });

    // Verificar se o material existe (se fornecido)
    if (validatedData.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: validatedData.materialId },
      });

      if (!material) {
        return NextResponse.json(
          { error: "Material não encontrado" },
          { status: 404 },
        );
      }
    }

    // Verificar se a organização existe (se fornecida)
    if (validatedData.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: validatedData.organizationId },
      });

      if (!organization) {
        return NextResponse.json(
          { error: "Organização não encontrada" },
          { status: 404 },
        );
      }
    }

    // Preparar dados para atualização (apenas campos definidos)
    const updateData: any = {};

    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.transactionType !== undefined)
      updateData.transactionType = validatedData.transactionType;
    if (validatedData.price !== undefined) {
      updateData.price = validatedData.price
        ? parseFloat(validatedData.price.toString())
        : null;
    }
    if (validatedData.quantity !== undefined)
      updateData.quantity = validatedData.quantity;
    if (validatedData.materialId !== undefined)
      updateData.materialId = validatedData.materialId || null;
    if (validatedData.organizationId !== undefined)
      updateData.organizationId = validatedData.organizationId || null;
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status;

    // Atualizar o item no banco de dados
    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        material: true,
        organization: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    // Atualizar coordenadas geográficas se fornecidas
    if (validatedData.latitude && validatedData.longitude) {
      await prisma.$executeRaw`
        UPDATE items 
        SET location = ST_Point(${validatedData.longitude}, ${validatedData.latitude})::geography
        WHERE id = ${id}
      `;
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error("Erro ao atualizar item:", error);

    // Erro de validação Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// DELETE /api/items/[id] - Excluir item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se o item existe
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: {
        createdBy: true,
        images: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o criador do item ou admin
    if (existingItem.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Você só pode excluir seus próprios itens" },
        { status: 403 },
      );
    }

    // Excluir imagens do UploadThing antes de excluir o item
    if (existingItem.images && existingItem.images.length > 0) {
      const imageUrls =
        existingItem.images
          ?.filter((img) => img.url?.startsWith("https://utfs.io/"))
          .map((img) => img.url)
          .filter((url): url is string => url !== null) ?? [];

      if (imageUrls.length > 0) {
        console.log(
          `🗑️ Excluindo ${imageUrls.length} imagens do UploadThing...`,
        );
        const deleteResult = await deleteUploadThingFiles(imageUrls);

        if (deleteResult.failed > 0) {
          console.warn(
            `⚠️ ${deleteResult.failed} imagens não puderam ser excluídas do UploadThing`,
          );
        }
      }
    }

    // Excluir o item (as imagens serão excluídas automaticamente por cascade)
    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Item excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// PATCH /api/items/[id]/status - Atualizar apenas o status do item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verificar se o item existe
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o criador do item ou admin
    if (existingItem.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Você só pode editar seus próprios itens" },
        { status: 403 },
      );
    }

    // Determinar qual campo atualizar baseado no conteúdo do body
    if (body.status !== undefined) {
      // Atualizar status
      const validatedData = updateStatusSchema.parse(body);

      const updatedItem = await prisma.item.update({
        where: { id },
        data: { status: validatedData.status },
        include: {
          material: true,
          organization: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: "Status atualizado com sucesso",
      });
    } else if (body.transactionType !== undefined) {
      // Atualizar tipo de transação
      const validatedData = updateTransactionTypeSchema.parse(body);

      const updatedItem = await prisma.item.update({
        where: { id },
        data: { transactionType: validatedData.transactionType },
        include: {
          material: true,
          organization: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: "Tipo de transação atualizado com sucesso",
      });
    } else {
      return NextResponse.json(
        { error: "Nenhum campo válido fornecido para atualização" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar item:", error);

    // Erro de validação Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
