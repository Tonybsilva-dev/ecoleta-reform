import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([]),
    $queryRawUnsafe: vi.fn().mockResolvedValue([
      {
        id: "item-1",
        title: "Test Item",
        description: "Test Description",
        status: "ACTIVE",
        price: "50.00",
        quantity: 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: "user-1",
        organization_id: "org-1",
        material_id: "material-1",
        longitude: -46.63,
        latitude: -23.55,
        distance_km: 5.2,
        material_name: "Plastic",
        material_category: "RECYCLABLE",
        organization_name: "Test Org",
        organization_verified: true,
        creator_name: "Test User",
        creator_email: "test@example.com",
        images: [
          {
            id: "img-1",
            url: "https://example.com/image.jpg",
            altText: "Test image",
            isPrimary: true,
          },
        ],
      },
    ]),
  },
}));

describe("GET /api/items/map", () => {
  it("should return items within map bounds", async () => {
    // Mock request with São Paulo coordinates
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?latitude=-23.55&longitude=-46.63&radius=10",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      success: true,
      data: {
        center: {
          latitude: -23.55,
          longitude: -46.63,
        },
        radius: 10,
        items: expect.any(Array),
        total: expect.any(Number),
      },
    });

    // Verify all returned items are within the specified radius
    if (data.data.items.length > 0) {
      data.data.items.forEach((item: { location: { latitude: number; longitude: number }; distance: number }) => {
        expect(item).toHaveProperty("location");
        expect(item.location).toHaveProperty("latitude");
        expect(item.location).toHaveProperty("longitude");
        expect(item).toHaveProperty("distance");
        expect(item.distance).toBeLessThanOrEqual(10); // Within 10km radius
      });
    }
  });

  it("should filter by material when provided", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?latitude=-23.55&longitude=-46.63&radius=10&materialId=cmaterial123456789",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.items).toBeDefined();
  });

  it("should filter by price range when provided", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?latitude=-23.55&longitude=-46.63&radius=10&minPrice=10&maxPrice=100",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.items).toBeDefined();
  });

  it("should return 400 for invalid coordinates", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?latitude=999&longitude=999&radius=10",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Parâmetros inválidos");
  });

  it("should return 400 for invalid radius", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?latitude=-23.55&longitude=-46.63&radius=200",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Parâmetros inválidos");
  });

  it("should handle missing coordinates gracefully", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/items/map?radius=10",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.center).toEqual({
      latitude: 0,
      longitude: 0,
    });
  });
});
