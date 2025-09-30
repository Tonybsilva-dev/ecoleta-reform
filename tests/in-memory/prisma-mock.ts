type EntityMap<T> = Map<string, T & { id: string }>;

function generateId() {
  // cuid-lite
  return `test_${Math.random().toString(36).slice(2, 10)}`;
}

export class InMemoryPrisma {
  users: EntityMap<Record<string, unknown>> = new Map();
  profiles: EntityMap<Record<string, unknown>> = new Map();
  materials: EntityMap<Record<string, unknown>> = new Map();
  items: EntityMap<Record<string, unknown>> = new Map();
  itemImages: EntityMap<Record<string, unknown>> = new Map();

  reset() {
    this.users.clear();
    this.profiles.clear();
    this.materials.clear();
    this.items.clear();
    this.itemImages.clear();
  }

  user = {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const id = (data as { id?: string }).id ?? generateId();
      const record = { ...data, id } as Record<string, unknown> & {
        id: string;
      };
      this.users.set(id, record);
      return record;
    },
    findUnique: async ({ where }: { where: Record<string, unknown> }) => {
      const w = where as { id?: string; email?: string };
      if (w?.id) return (this.users.get(w.id) as unknown) ?? null;
      if (w?.email)
        return (
          Array.from(this.users.values()).find(
            (u) => (u as { email?: string }).email === w.email,
          ) ?? null
        );
      return null;
    },
    deleteMany: async ({ where }: { where?: Record<string, any> } = {}) => {
      if (!where) {
        this.users.clear();
        return { count: 0 } as const;
      }
      for (const [id, u] of this.users) {
        const email = (
          where as { email?: { startsWith?: string; contains?: string } }
        ).email;
        if (
          email?.startsWith &&
          (u as { email?: string }).email?.startsWith(email.startsWith)
        ) {
          this.users.delete(id);
        }
        if (
          email?.contains &&
          (u as { email?: string }).email?.includes(email.contains)
        ) {
          this.users.delete(id);
        }
      }
      return { count: 0 } as const;
    },
  };

  profile = {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const id = (data as { id?: string }).id ?? generateId();
      const record = { ...data, id } as Record<string, unknown> & {
        id: string;
      };
      this.profiles.set(id, record);
      return record;
    },
    findFirst: async ({ where }: { where?: Record<string, unknown> } = {}) => {
      const all = Array.from(this.profiles.values());
      const w = where as
        | { user?: { email?: { equals?: string } | string } }
        | undefined;
      if (w?.user?.email) {
        const email =
          typeof w.user.email === "string"
            ? w.user.email
            : (w.user.email.equals ?? undefined);
        const u = Array.from(this.users.values()).find(
          (x) => (x as { email?: string }).email === email,
        ) as { id?: string } | undefined;
        return (
          all.find((p) => (p as { userId?: string }).userId === u?.id) ?? null
        );
      }
      return all[0] ?? null;
    },
    deleteMany: async ({ where }: { where?: Record<string, unknown> } = {}) => {
      if (!where) {
        this.profiles.clear();
        return { count: 0 } as const;
      }
      for (const [id, p] of this.profiles) {
        const contains = (where as { user?: { email?: { contains?: string } } })
          .user?.email?.contains as string | undefined;
        if (contains) {
          const user = this.users.get((p as { userId?: string }).userId ?? "");
          if ((user as { email?: string })?.email?.includes(contains))
            this.profiles.delete(id);
        }
      }
      return { count: 0 } as const;
    },
  };

  material = {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      // unique(name)
      const dup = Array.from(this.materials.values()).find(
        (m) =>
          (m as { name?: string }).name === (data as { name?: string }).name,
      );
      if (dup)
        throw new Error("Unique constraint failed on the fields: (name)");
      const id = (data as { id?: string }).id ?? generateId();
      const record = {
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        id,
      } as Record<string, unknown> & { id: string };
      this.materials.set(id, record);
      return record;
    },
    findUnique: async ({
      where,
      include,
    }: {
      where: Record<string, unknown>;
      include?: Record<string, unknown>;
    }) => {
      const w = where as { id: string };
      const inc = include as { items?: boolean } | undefined;
      const record = (this.materials.get(w.id) as unknown) ?? null;
      if (!record) return null;
      if (inc?.items) {
        const items = Array.from(this.items.values()).filter(
          (it) =>
            (it as { materialId?: string }).materialId ===
            (record as { id: string }).id,
        );
        return { ...(record as object), items } as unknown;
      }
      return record;
    },
    deleteMany: async () => {
      this.materials.clear();
      return { count: 0 } as const;
    },
  };

  item = {
    create: async ({
      data,
      include,
    }: {
      data: Record<string, unknown>;
      include?: Record<string, unknown>;
    }) => {
      const id = (data as { id?: string }).id ?? generateId();
      const record = {
        status: "ACTIVE",
        materialId: null,
        ...data,
        id,
      } as Record<string, unknown> & { id: string };
      this.items.set(id, record);
      if (!include) return record;
      const inc = include as { material?: boolean; createdBy?: boolean };
      return {
        ...record,
        material: inc.material
          ? (this.materials.get(
              (record as { materialId?: string | null }).materialId ?? "",
            ) as unknown)
          : undefined,
        createdBy: inc.createdBy
          ? (this.users.get(
              (record as { createdById?: string }).createdById ?? "",
            ) as unknown)
          : undefined,
      } as unknown;
    },
    createMany: async ({ data }: { data: Record<string, unknown>[] }) => {
      for (const d of data) {
        const id = (d as { id?: string }).id ?? generateId();
        this.items.set(id, { status: "ACTIVE", ...d, id } as Record<
          string,
          unknown
        > & { id: string });
      }
      return { count: data.length } as const;
    },
    delete: async ({ where }: { where: Record<string, unknown> }) => {
      const id = (where as { id: string }).id;
      this.items.delete(id);
      // cascade
      for (const [imgId, img] of this.itemImages) {
        if ((img as { itemId?: string }).itemId === id)
          this.itemImages.delete(imgId);
      }
      return null as unknown as never;
    },
    deleteMany: async () => {
      this.items.clear();
      this.itemImages.clear();
      return { count: 0 } as const;
    },
  };

  itemImage = {
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const id = (data as { id?: string }).id ?? generateId();
      const record = { ...data, id } as Record<string, unknown> & {
        id: string;
      };
      this.itemImages.set(id, record);
      return record;
    },
    findMany: async ({ where }: { where?: Record<string, unknown> } = {}) => {
      const all = Array.from(this.itemImages.values());
      const w = where as { itemId?: string } | undefined;
      if (w?.itemId)
        return all.filter(
          (i) => (i as { itemId?: string }).itemId === w.itemId,
        );
      return all;
    },
    deleteMany: async () => {
      this.itemImages.clear();
      return { count: 0 } as const;
    },
  };
}

export const prismaInMemory = new InMemoryPrisma();
