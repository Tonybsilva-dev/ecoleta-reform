import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/server";

import { authOptions } from "@/lib/auth.config";

const f = createUploadthing();

// Exportado para tipagem do cliente
export const ourFileRouter = {
  // Endpoint para imagens de itens
  itemImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new Error("Unauthorized");
      return { userId: session.user.id } as const;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Podemos registrar auditoria aqui no futuro
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
