import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Componente de exemplo para testar
function ExampleButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} data-testid="example-button">
      {children}
    </button>
  );
}

describe("ExampleButton", () => {
  it("should render button with text", () => {
    render(<ExampleButton onClick={vi.fn()}>Click me</ExampleButton>);

    expect(screen.getByTestId("example-button")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ExampleButton onClick={handleClick}>Click me</ExampleButton>);

    await user.click(screen.getByTestId("example-button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
