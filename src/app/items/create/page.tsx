import type { Metadata } from "next";
import { ItemCreationForm } from "@/components/items/ItemCreationForm";
import { MainLayout } from "@/components/layout";

export const metadata: Metadata = {
  title: "Criar Item | Ecoleta",
  description: "Crie um novo item para venda, doação ou coleta no Ecoleta",
};

export default function CreateItemPage() {
  return (
    <MainLayout className="py-12">
      <div className="mx-auto w-full max-w-2xl">
        <ItemCreationForm />
      </div>
    </MainLayout>
  );
}
