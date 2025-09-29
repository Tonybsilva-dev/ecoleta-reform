import Image from "next/image";
import Link from "next/link";
import { MainLayout, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";

async function getItem(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      createdBy: { include: { profile: true } },
      organization: true,
      material: true,
      images: true,
      orders: true,
    },
  });
  return item;
}

export default async function DashboardItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeader
            title="Item não encontrado"
            description="O item solicitado não existe ou foi removido."
            actions={
              <Button asChild>
                <Link href="/dashboard/items">Voltar</Link>
              </Button>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const primaryImage = item.images?.[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={item.title}
          description={item.description || ""}
          actions={
            <Button asChild>
              <Link href="/dashboard/items">Voltar</Link>
            </Button>
          }
        />

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {primaryImage ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={primaryImage.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                Sem imagem
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Preço</div>
              <div className="font-semibold text-lg">
                {item.price ? `R$ ${Number(item.price).toFixed(2)}` : "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Quantidade</div>
              <div className="font-semibold text-lg">
                {item.quantity ?? "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Material</div>
              <div className="font-semibold text-lg">
                {item.material?.name ?? "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="font-semibold text-lg">{item.status}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
