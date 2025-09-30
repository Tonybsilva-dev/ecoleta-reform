type EntityMap<T> = Map<string, T & { id: string }>;

function generateId() {
  // cuid-lite
  return `test_${Math.random().toString(36).slice(2, 10)}`;
}

export class InMemoryPrisma {
  users: EntityMap<any> = new Map();
  profiles: EntityMap<any> = new Map();
  materials: EntityMap<any> = new Map();
  items: EntityMap<any> = new Map();
  itemImages: EntityMap<any> = new Map();

  reset() {
    this.users.clear();
    this.profiles.clear();
    this.materials.clear();
    this.items.clear();
    this.itemImages.clear();
  }

  user = {
    create: async ({ data }: { data: any }) => {
      const id = data.id ?? generateId();
      const record = { ...data, id };
      this.users.set(id, record);
      return record;
    },
    findUnique: async ({ where }: { where: any }) => {
      if (where?.id) return this.users.get(where.id) ?? null;
      if (where?.email)
        return (
          Array.from(this.users.values()).find(
            (u) => u.email === where.email,
          ) ?? null
        );
      return null;
    },
    deleteMany: async ({ where }: { where?: any } = {}) => {
      if (!where) {
        this.users.clear();
        return { count: 0 };
      }
      for (const [id, u] of this.users) {
        if (
          where.email?.startsWith &&
          u.email?.startsWith(where.email.startsWith)
        ) {
          this.users.delete(id);
        }
        if (where.email?.contains && u.email?.includes(where.email.contains)) {
          this.users.delete(id);
        }
      }
      return { count: 0 };
    },
  };

  profile = {
    create: async ({ data }: { data: any }) => {
      const id = data.id ?? generateId();
      const record = { ...data, id };
      this.profiles.set(id, record);
      return record;
    },
    findFirst: async ({ where }: { where?: any } = {}) => {
      const all = Array.from(this.profiles.values());
      if (where?.user?.email) {
        const email = where.user.email.equals ?? where.user.email;
        const u = Array.from(this.users.values()).find(
          (x) => x.email === email,
        );
        return all.find((p) => p.userId === u?.id) ?? null;
      }
      return all[0] ?? null;
    },
    deleteMany: async ({ where }: { where?: any } = {}) => {
      if (!where) {
        this.profiles.clear();
        return { count: 0 };
      }
      for (const [id, p] of this.profiles) {
        if (where.user?.email?.contains) {
          const user = this.users.get(p.userId);
          if (user?.email?.includes(where.user.email.contains))
            this.profiles.delete(id);
        }
      }
      return { count: 0 };
    },
  };

  material = {
    create: async ({ data }: { data: any }) => {
      // unique(name)
      const dup = Array.from(this.materials.values()).find(
        (m) => m.name === data.name,
      );
      if (dup)
        throw new Error("Unique constraint failed on the fields: (name)");
      const id = data.id ?? generateId();
      const record = {
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        id,
      };
      this.materials.set(id, record);
      return record;
    },
    findUnique: async ({ where, include }: { where: any; include?: any }) => {
      const record = this.materials.get(where.id) ?? null;
      if (!record) return null;
      if (include?.items) {
        const items = Array.from(this.items.values()).filter(
          (it) => it.materialId === record.id,
        );
        return { ...record, items };
      }
      return record;
    },
    deleteMany: async () => {
      this.materials.clear();
      return { count: 0 };
    },
  };

  item = {
    create: async ({ data, include }: { data: any; include?: any }) => {
      const id = data.id ?? generateId();
      const record = { status: "ACTIVE", materialId: null, ...data, id };
      this.items.set(id, record);
      if (!include) return record;
      return {
        ...record,
        material: include.material
          ? this.materials.get(record.materialId)
          : undefined,
        createdBy: include.createdBy
          ? this.users.get(record.createdById)
          : undefined,
      };
    },
    createMany: async ({ data }: { data: any[] }) => {
      for (const d of data) {
        const id = d.id ?? generateId();
        this.items.set(id, { status: "ACTIVE", ...d, id });
      }
      return { count: data.length };
    },
    delete: async ({ where }: { where: any }) => {
      this.items.delete(where.id);
      // cascade
      for (const [imgId, img] of this.itemImages) {
        if (img.itemId === where.id) this.itemImages.delete(imgId);
      }
      return null as any;
    },
    deleteMany: async () => {
      this.items.clear();
      this.itemImages.clear();
      return { count: 0 };
    },
  };

  itemImage = {
    create: async ({ data }: { data: any }) => {
      const id = data.id ?? generateId();
      const record = { ...data, id };
      this.itemImages.set(id, record);
      return record;
    },
    findMany: async ({ where }: { where?: any } = {}) => {
      const all = Array.from(this.itemImages.values());
      if (where?.itemId) return all.filter((i) => i.itemId === where.itemId);
      return all;
    },
    deleteMany: async () => {
      this.itemImages.clear();
      return { count: 0 };
    },
  };
}

export const prismaInMemory = new InMemoryPrisma();
