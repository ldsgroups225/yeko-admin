import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component with consistent styling and accessibility features. Supports various input types and states.",
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
            id: "label",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The type of input",
    },
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text for the input",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the input is disabled",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes to apply to the input",
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" />
    </div>
  ),
  args: {
    type: "email",
    placeholder: "Email",
  },
};

export const Password: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="password">Password</Label>
      <Input {...args} id="password" />
    </div>
  ),
  args: {
    type: "password",
    placeholder: "Password",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
};

export const NumberInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="number">Age</Label>
      <Input {...args} id="number" />
    </div>
  ),
  args: {
    type: "number",
    placeholder: "25",
  },
};

export const Search: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="search">Search</Label>
      <Input {...args} id="search" />
    </div>
  ),
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

export const File: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input {...args} id="picture" />
    </div>
  ),
  args: {
    type: "file",
  },
};

export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
  args: {
    type: "email",
    placeholder: "Email",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Input combined with a button for forms like newsletter subscriptions.",
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-4">
      <div className="grid items-center gap-1.5">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="John" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Doe" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A complete form example showing multiple input types with labels.",
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="grid items-center gap-1.5">
        <Label htmlFor="valid">Valid Input</Label>
        <Input
          id="valid"
          defaultValue="Valid input"
          className="border-green-500"
        />
        <p className="text-sm text-green-600">This field is valid.</p>
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="invalid">Invalid Input</Label>
        <Input
          id="invalid"
          defaultValue="Invalid input"
          aria-invalid="true"
          className="border-red-500"
        />
        <p className="text-sm text-red-600">This field has an error.</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples of input validation states with visual feedback.",
      },
    },
  },
};
