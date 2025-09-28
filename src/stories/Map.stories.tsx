import type { Meta, StoryObj } from "@storybook/react";
import { Map as MapComponent } from "@/components/map";

const meta: Meta<typeof MapComponent> = {
  title: "Components/Map",
  component: MapComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    center: {
      control: "object",
      description: "Center coordinates [latitude, longitude]",
    },
    zoom: {
      control: { type: "number", min: 1, max: 18 },
      description: "Zoom level",
    },
    height: {
      control: "text",
      description: "Map height",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    center: [-23.5505, -46.6333], // São Paulo
    zoom: 13,
    height: "400px",
    className: "rounded-lg border shadow-sm",
  },
};

export const RioDeJaneiro: Story = {
  args: {
    center: [-22.9068, -43.1729], // Rio de Janeiro
    zoom: 12,
    height: "400px",
    className: "rounded-lg border shadow-sm",
  },
};

export const Brasilia: Story = {
  args: {
    center: [-15.7801, -47.9292], // Brasília
    zoom: 11,
    height: "400px",
    className: "rounded-lg border shadow-sm",
  },
};

export const Small: Story = {
  args: {
    center: [-23.5505, -46.6333],
    zoom: 13,
    height: "200px",
    className: "rounded-lg border",
  },
};

export const Large: Story = {
  args: {
    center: [-23.5505, -46.6333],
    zoom: 13,
    height: "600px",
    className: "rounded-lg border shadow-lg",
  },
};
