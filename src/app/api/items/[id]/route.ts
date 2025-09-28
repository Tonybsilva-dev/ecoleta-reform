import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { updateItemSchema } from "@/lib/validations/item.schema";

// GET /api/items/[id] - Buscar item por ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validar ID
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID do item é obrigatório" },
        { status: 400 },
      );
    }

    // Buscar item
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        material: true,
        organization: {
          select: {
            id: true,
            name: true,
            verified: true,
            description: true,
            website: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        images: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Erro ao buscar item:", error);
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

    // Validar ID
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID do item é obrigatório" },
        { status: 400 },
      );
    }

    // Validar dados de entrada
    const body = await request.json();
    const validatedData = updateItemSchema.parse({ ...body, id });

    // Verificar se o item existe e se o usuário tem permissão
    const existingItem = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        createdById: true,
        organizationId: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar permissões (criador do item ou membro da organização)
    const isOwner = existingItem.createdById === session.user.id;
    // TODO: Implementar verificação de membro da organização quando o modelo OrganizationMember for criado
    const isOrganizationMember = false;

    if (!isOwner && !isOrganizationMember) {
      return NextResponse.json(
        { error: "Sem permissão para editar este item" },
        { status: 403 },
      );
    }

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

    // Preparar dados para atualização
    const updateData: any = {};

    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.price !== undefined) {
      updateData.price = validatedData.price
        ? parseFloat(validatedData.price.toString())
        : null;
    }
    if (validatedData.quantity !== undefined)
      updateData.quantity = validatedData.quantity;
    if (validatedData.materialId !== undefined)
      updateData.materialId = validatedData.materialId;
    if (validatedData.organizationId !== undefined)
      updateData.organizationId = validatedData.organizationId;
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status;

    // Atualizar coordenadas geográficas se fornecidas
    if (validatedData.latitude && validatedData.longitude) {
      updateData.location = {
        type: "Point",
        coordinates: [validatedData.longitude, validatedData.latitude],
      };
    }

    // Atualizar o item
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
        images: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: "Item atualizado com sucesso",
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

// DELETE /api/items/[id] - Deletar item
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

    // Validar ID
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID do item é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se o item existe e se o usuário tem permissão
    const existingItem = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        createdById: true,
        organizationId: true,
        status: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 },
      );
    }

    // Verificar permissões (criador do item ou membro da organização)
    const isOwner = existingItem.createdById === session.user.id;
    // TODO: Implementar verificação de membro da organização quando o modelo OrganizationMember for criado
    const isOrganizationMember = false;

    if (!isOwner && !isOrganizationMember) {
      return NextResponse.json(
        { error: "Sem permissão para deletar este item" },
        { status: 403 },
      );
    }

    // Verificar se o item pode ser deletado (não pode estar vendido/coletado)
    if (existingItem.status === "SOLD" || existingItem.status === "COLLECTED") {
      return NextResponse.json(
        {
          error:
            "Não é possível deletar um item que já foi vendido ou coletado",
        },
        { status: 400 },
      );
    }

    // Deletar o item (cascade deletará as imagens automaticamente)
    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Item deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar item:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
