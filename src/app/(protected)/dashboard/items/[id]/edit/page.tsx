import { ItemEditClient } from "@/components/item-edit-client";
import { MainLayout } from "@/components/layout";

export default async function DashboardItemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <MainLayout>
      <ItemEditClient id={id} />
    </MainLayout>
  );
}
