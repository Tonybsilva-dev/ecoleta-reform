import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prismaInMemory as prisma } from "@/../tests/in-memory/prisma-mock";

describe("Material, Item, and ItemImage Models (in-memory)", () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.itemImage.deleteMany();
    await prisma.item.deleteMany();
    await prisma.material.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "test",
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.itemImage.deleteMany();
    await prisma.item.deleteMany();
    await prisma.material.deleteMany();
    await prisma.user.deleteMany({ where: { email: { startsWith: "test" } } });
  });

  describe("Material Model", () => {
    it("should create a material with all required fields", async () => {
      const material = await prisma.material.create({
        data: {
          name: "Plástico PET",
          description: "Garrafas de plástico PET reciclável",
          category: "Plastic",
        },
      });

      expect(material).toMatchObject({
        name: "Plástico PET",
        description: "Garrafas de plástico PET reciclável",
        category: "Plastic",
        isActive: true,
      });
      expect(material.id).toBeDefined();
      expect(material.createdAt).toBeDefined();
      expect(material.updatedAt).toBeDefined();
    });

    it("should enforce unique constraint on material name", async () => {
      await prisma.material.create({
        data: {
          name: "Vidro",
          category: "Glass",
        },
      });

      await expect(
        prisma.material.create({
          data: {
            name: "Vidro", // Duplicate name
            category: "Glass",
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe("Item Model", () => {
    it("should create an item with material relationship", async () => {
      // Create test material
      const material = await prisma.material.create({
        data: {
          name: "Papel",
          category: "Paper",
        },
      });

      // Create test user
      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });

      const item = await prisma.item.create({
        data: {
          title: "Papelão para reciclagem",
          description: "Caixas de papelão limpas",
          quantity: 5,
          price: 10.5,
          createdById: user.id,
          materialId: material.id,
        },
        include: {
          material: true,
          createdBy: true,
        },
      });

      expect(item).toMatchObject({
        title: "Papelão para reciclagem",
        description: "Caixas de papelão limpas",
        quantity: 5,
        status: "ACTIVE",
      });
      expect(item.price?.toString()).toBe("10.5");
      expect(item.material).toMatchObject({
        name: "Papel",
        category: "Paper",
      });
      expect(item.createdBy).toMatchObject({
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should create an item without material (optional relationship)", async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          email: "test2@example.com",
          name: "Test User 2",
        },
      });

      const item = await prisma.item.create({
        data: {
          title: "Item sem material específico",
          description: "Item genérico",
          quantity: 1,
          createdById: user.id,
        },
      });

      expect(item).toMatchObject({
        title: "Item sem material específico",
        description: "Item genérico",
        quantity: 1,
        materialId: null,
      });
    });
  });

  describe("ItemImage Model", () => {
    it("should create item images with proper relationships", async () => {
      // Create test user and item
      const user = await prisma.user.create({
        data: {
          email: "test3@example.com",
          name: "Test User 3",
        },
      });

      const item = await prisma.item.create({
        data: {
          title: "Item com imagens",
          description: "Item para testar imagens",
          quantity: 1,
          createdById: user.id,
        },
      });

      const image1 = await prisma.itemImage.create({
        data: {
          url: "https://example.com/image1.jpg",
          altText: "Imagem principal do item",
          isPrimary: true,
          itemId: item.id,
        },
      });

      const image2 = await prisma.itemImage.create({
        data: {
          url: "https://example.com/image2.jpg",
          altText: "Imagem secundária do item",
          isPrimary: false,
          itemId: item.id,
        },
      });

      expect(image1).toMatchObject({
        url: "https://example.com/image1.jpg",
        altText: "Imagem principal do item",
        isPrimary: true,
        itemId: item.id,
      });

      expect(image2).toMatchObject({
        url: "https://example.com/image2.jpg",
        altText: "Imagem secundária do item",
        isPrimary: false,
        itemId: item.id,
      });
    });

    it("should cascade delete images when item is deleted", async () => {
      // Create a new item with images
      const user = await prisma.user.create({
        data: {
          email: "test4@example.com",
          name: "Test User 4",
        },
      });

      const testItem = await prisma.item.create({
        data: {
          title: "Item para deletar",
          description: "Item que será deletado",
          quantity: 1,
          createdById: user.id,
        },
      });

      await prisma.itemImage.create({
        data: {
          url: "https://example.com/delete-test.jpg",
          itemId: testItem.id,
        },
      });

      // Delete the item
      await prisma.item.delete({
        where: { id: testItem.id },
      });

      // Verify images were also deleted
      const remainingImages = await prisma.itemImage.findMany({
        where: { itemId: testItem.id },
      });

      expect(remainingImages).toHaveLength(0);
    });
  });

  describe("Model Relationships", () => {
    it("should properly handle Material -> Items relationship", async () => {
      const material = await prisma.material.create({
        data: {
          name: "Metal",
          category: "Metal",
        },
      });

      const user = await prisma.user.create({
        data: {
          email: "test5@example.com",
          name: "Test User 5",
        },
      });

      // Create multiple items for the same material
      await prisma.item.createMany({
        data: [
          {
            title: "Latas de alumínio",
            quantity: 10,
            createdById: user.id,
            materialId: material.id,
          },
          {
            title: "Fios de cobre",
            quantity: 5,
            createdById: user.id,
            materialId: material.id,
          },
        ],
      });

      // Fetch material with items
      const materialWithItems = await prisma.material.findUnique({
        where: { id: material.id },
        include: { items: true },
      });

      expect(materialWithItems?.items).toHaveLength(2);
      expect(materialWithItems?.items[0]?.materialId).toBe(material.id);
      expect(materialWithItems?.items[1]?.materialId).toBe(material.id);
    });
  });
});
