import { prismaInMemory } from "../in-memory/prisma-mock";

function rand() {
  return Math.random().toString(36).slice(2, 8);
}

export const factory = {
  async user(attrs: Partial<any> = {}) {
    return prismaInMemory.user.create({
      data: {
        email: attrs.email ?? `test_${rand()}@example.com`,
        name: attrs.name ?? "Test User",
        password: attrs.password ?? "hash",
        ...attrs,
      },
    });
  },
  async material(attrs: Partial<any> = {}) {
    return prismaInMemory.material.create({
      data: {
        name: attrs.name ?? `Material ${rand()}`,
        category: attrs.category ?? "Generic",
        description: attrs.description ?? null,
        ...attrs,
      },
    });
  },
  async item(attrs: Partial<any> = {}) {
    const user = attrs.createdById
      ? { id: attrs.createdById as string }
      : await factory.user({});
    const material = attrs.materialId
      ? { id: attrs.materialId as string }
      : attrs.materialId === null
        ? null
        : await factory.material({});

    return prismaInMemory.item.create({
      data: {
        title: attrs.title ?? `Item ${rand()}`,
        description: attrs.description ?? null,
        quantity: attrs.quantity ?? 1,
        price: attrs.price ?? null,
        createdById: user.id,
        materialId: material ? material.id : null,
        ...attrs,
      },
      include: { material: true, createdBy: true },
    });
  },
  async image(itemId: string, attrs: Partial<any> = {}) {
    return prismaInMemory.itemImage.create({
      data: {
        url: attrs.url ?? `https://example.com/${rand()}.jpg`,
        altText: attrs.altText ?? null,
        isPrimary: attrs.isPrimary ?? false,
        itemId,
        ...attrs,
      },
    });
  },
  reset() {
    prismaInMemory.reset();
  },
};
