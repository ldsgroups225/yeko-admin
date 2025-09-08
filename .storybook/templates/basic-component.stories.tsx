import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ComponentName } from "./component-name";

/**
 * Basic Component Story Template
 *
 * This template is for simple components with minimal props and variants.
 * Use this for components like Button, Badge, Avatar, etc.
 */

const meta = {
  title: "UI/ComponentName", // Update the title
  component: ComponentName, // Update the component import
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Brief description of what this component does and its purpose.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          // Add other accessibility rules as needed
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Define your component's props here
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive"], // Update options
      description: "The visual style variant of the component",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"], // Update options
      description: "The size of the component",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the component is disabled",
    },
    // Add more props as needed
  },
  args: {
    // Add default event handlers if needed
    onClick: fn(),
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variant stories
export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// State variants
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

// Interactive example
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        With Icon
      </>
    ),
  },
};

// Comparison stories
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="destructive">Destructive</ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All component variants displayed together for comparison.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="default">Default</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All component sizes displayed together for comparison.",
      },
    },
  },
};
