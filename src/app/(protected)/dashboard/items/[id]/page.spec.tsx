import { render, screen, waitFor } from "@testing-library/react";

// Mock do fetch para simular a API
global.fetch = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user_1" } },
    status: "authenticated",
  }),
}));

import Page from "./page";

describe("Dashboard item details (server)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render item title", async () => {
    // Mock da resposta da API
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "it_1",
        title: "Item no dashboard",
        description: "Detalhes",
        quantity: 1,
        images: [],
        createdAt: new Date().toISOString(),
      }),
    });

    // @ts-expect-error server component
    const ui = await Page({ params: Promise.resolve({ id: "it_1" }) });
    render(ui);

    await waitFor(() => {
      expect(screen.getByText("Item no dashboard")).toBeInTheDocument();
    });
  });
});
