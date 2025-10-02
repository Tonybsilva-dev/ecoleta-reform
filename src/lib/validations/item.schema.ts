import { z } from "zod";

// Enum para status do item
export const ItemStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SOLD",
  "DONATED",
  "COLLECTED",
]);

// Schema para criação de item
export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional(),

  price: z
    .number()
    .min(0, "Preço deve ser maior ou igual a zero")
    .max(999999.99, "Preço deve ser menor que R$ 999.999,99")
    .optional(),

  quantity: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser pelo menos 1")
    .max(9999, "Quantidade deve ser menor que 10.000")
    .default(1),

  materialId: z.string().cuid("ID do material inválido").optional(),

  materialType: z.string().optional(),

  unit: z.string().optional(),

  transactionType: z.enum(["SALE", "DONATION", "COLLECTION"]).optional(),

  address: z.string().optional(),

  organizationId: z.string().cuid("ID da organização inválido").optional(),

  // Coordenadas geográficas (latitude e longitude)
  latitude: z
    .number()
    .min(-90, "Latitude deve estar entre -90 e 90")
    .max(90, "Latitude deve estar entre -90 e 90")
    .optional(),

  longitude: z
    .number()
    .min(-180, "Longitude deve estar entre -180 e 180")
    .max(180, "Longitude deve estar entre -180 e 180")
    .optional(),

  // URLs das imagens ou dados base64
  imageUrls: z
    .array(z.string().url("URL da imagem inválida"))
    .min(1, "Pelo menos uma imagem é obrigatória")
    .max(5, "Máximo de 5 imagens permitidas"),

  // Texto alternativo para as imagens
  imageAltTexts: z
    .array(
      z
        .string()
        .max(200, "Texto alternativo deve ter no máximo 200 caracteres"),
    )
    .optional(),
});

// Schema para atualização de item
export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string().cuid("ID do item inválido"),
  status: ItemStatusSchema.optional(),
});

// Schema para busca de itens
export const searchItemsSchema = z.object({
  query: z.string().optional(),
  materialId: z.string().cuid().optional(),
  organizationId: z.string().cuid().optional(),
  status: ItemStatusSchema.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius: z.number().min(0.1).max(100).default(10), // raio em km
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Schema para filtros de itens no mapa
export const mapItemsSchema = z.object({
  materialId: z.string().cuid().optional(),
  organizationId: z.string().cuid().optional(),
  status: ItemStatusSchema.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0.1).max(100).default(10),
});

// Tipos TypeScript derivados dos schemas
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type SearchItemsInput = z.infer<typeof searchItemsSchema>;
export type MapItemsInput = z.infer<typeof mapItemsSchema>;
export type ItemStatus = z.infer<typeof ItemStatusSchema>;
