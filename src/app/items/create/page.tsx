import type { Metadata } from "next";

import { ItemCreationForm } from "@/components/items/ItemCreationForm";

export const metadata: Metadata = {
  title: "Criar Item | Ecoleta",
  description: "Crie um novo item para venda, doação ou coleta no Ecoleta",
};

export default function CreateItemPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ItemCreationForm />
    </main>
  );
}
