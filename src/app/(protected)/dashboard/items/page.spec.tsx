import { render, screen } from "@testing-library/react";

// Mock do store para evitar chamadas reais
vi.mock("@/lib/stores", () => {
  return {
    useItemsStore: () => ({
      items: [
        {
          id: "it_1",
          title: "Garrafa PET",
          description: "Usadas",
          quantity: 2,
          price: 5,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          material: { name: "Plástico" },
        },
      ],
      isLoading: false,
      error: null,
      loadItems: vi.fn(),
    }),
  };
});

import ItemsPage from "./page";

describe("Dashboard Items page (client)", () => {
  it("should render list with item card", () => {
    render(<ItemsPage />);
    expect(screen.getAllByText("Meus Itens")[0]).toBeInTheDocument();
    expect(screen.getByText("Garrafa PET")).toBeInTheDocument();
  });
});
