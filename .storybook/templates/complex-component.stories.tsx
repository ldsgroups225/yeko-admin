import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

/**
 * Complex Component Story Template
 *
 * This template is for complex components with multiple sub-components,
 * rich content, and various use cases. Use this for components like
 * Card, Dialog, Form, Table, etc.
 */

const meta = {
  title: "UI/ComponentName", // Update the title
  component: ComponentName, // Update the component import
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Detailed description of what this component does, its purpose, and when to use it.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "landmark-one-main",
            enabled: false, // Adjust based on component type
          },
          // Add other accessibility rules as needed
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Define your component's props here
    className: {
      control: { type: "text" },
      description: "Additional CSS classes to apply to the component",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "outline", "ghost"], // Update options
      description: "The visual style variant of the component",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"], // Update options
      description: "The size of the component",
    },
    // Add more props as needed
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
  render: () => (
    <ComponentName className="w-[350px]">
      {/* Basic content structure */}
      <div>Basic content</div>
    </ComponentName>
  ),
};

// With header and content
export const WithHeader: Story = {
  render: () => (
    <ComponentName className="w-[350px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Header Title</h3>
        <p className="text-muted-foreground">Header description</p>
      </div>
      <div className="p-6 pt-0">
        <p>Main content goes here.</p>
      </div>
    </ComponentName>
  ),
};

// With footer
export const WithFooter: Story = {
  render: () => (
    <ComponentName className="w-[350px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Title</h3>
        <p className="text-muted-foreground">Description</p>
      </div>
      <div className="p-6 pt-0">
        <p>Main content goes here.</p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex justify-between">
          <button type="button" className="px-4 py-2 text-sm border rounded">
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded"
          >
            Action
          </button>
        </div>
      </div>
    </ComponentName>
  ),
};

// Complex example with rich content
export const ComplexExample: Story = {
  render: () => (
    <ComponentName className="w-[400px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Complex Example</h3>
        <p className="text-muted-foreground">
          This shows a more complex usage pattern.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm">Feature item 1</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm">Feature item 2</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm">Feature item 3</p>
          </div>
        </div>
      </div>
    </ComponentName>
  ),
  parameters: {
    docs: {
      description: {
        story: "A complex example showing rich content and multiple sections.",
      },
    },
  },
};

// Real-world usage example
export const RealWorldExample: Story = {
  render: () => (
    <ComponentName className="w-[300px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Product Plan</h3>
        <p className="text-muted-foreground">
          Everything you need for your business.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="text-3xl font-bold">
            $29
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <title>Feature 1</title>
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Feature 1
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <title>Feature 2</title>
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Feature 2
            </li>
          </ul>
        </div>
      </div>
      <div className="p-6 pt-0">
        <button
          type="button"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Get Started
        </button>
      </div>
    </ComponentName>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A real-world example showing how the component might be used in production.",
      },
    },
  },
};

// Grid/Collection example
export const GridExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <ComponentName>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Item 1</h3>
          <p className="text-muted-foreground">Description for item 1</p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">Value 1</div>
          <p className="text-xs text-muted-foreground">+10% from last period</p>
        </div>
      </ComponentName>
      <ComponentName>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Item 2</h3>
          <p className="text-muted-foreground">Description for item 2</p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">Value 2</div>
          <p className="text-xs text-muted-foreground">+20% from last period</p>
        </div>
      </ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple components arranged in a responsive grid layout.",
      },
    },
  },
};
