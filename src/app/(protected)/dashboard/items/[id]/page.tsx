import { ItemDetailsClient } from "@/components/item-details-client";
import { MainLayout } from "@/components/layout";

export default async function DashboardItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <MainLayout>
      <ItemDetailsClient id={id} />
    </MainLayout>
  );
}
