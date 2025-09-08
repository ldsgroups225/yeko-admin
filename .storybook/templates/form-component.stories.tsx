import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ComponentName } from "./component-name";

/**
 * Form Component Story Template
 *
 * This template is for form-related components like Input, Select,
 * Checkbox, RadioGroup, etc. Focuses on form states, validation,
 * and accessibility.
 */

const meta = {
  title: "UI/ComponentName", // Update the title
  component: ComponentName, // Update the component import
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Description of the form component and its purpose in forms.",
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
          {
            id: "form-field-multiple-labels",
            enabled: true,
          },
          // Add other form-specific accessibility rules
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // Define your component's props here
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "search"], // Update for your component
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
    required: {
      control: { type: "boolean" },
      description: "Whether the input is required",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes to apply to the input",
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
    onFocus: fn(),
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

// With label
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="input" className="text-sm font-medium">
        Label
      </label>
      <ComponentName {...args} id="input" />
    </div>
  ),
  args: {
    placeholder: "Enter value...",
  },
};

// Different input types
export const Email: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <ComponentName {...args} id="email" />
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
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <ComponentName {...args} id="password" />
    </div>
  ),
  args: {
    type: "password",
    placeholder: "Password",
  },
};

export const NumberInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="number" className="text-sm font-medium">
        Age
      </label>
      <ComponentName {...args} id="number" />
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
      <label htmlFor="search" className="text-sm font-medium">
        Search
      </label>
      <ComponentName {...args} id="search" />
    </div>
  ),
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Required: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="required" className="text-sm font-medium">
        Required Field <span className="text-red-500">*</span>
      </label>
      <ComponentName {...args} id="required" />
    </div>
  ),
  args: {
    placeholder: "This field is required",
    required: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
};

// Validation states
export const ValidState: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="valid" className="text-sm font-medium">
        Valid Input
      </label>
      <ComponentName
        {...args}
        id="valid"
        defaultValue="Valid input"
        className="border-green-500"
      />
      <p className="text-sm text-green-600">This field is valid.</p>
    </div>
  ),
};

export const InvalidState: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="invalid" className="text-sm font-medium">
        Invalid Input
      </label>
      <ComponentName
        {...args}
        id="invalid"
        defaultValue="Invalid input"
        aria-invalid="true"
        className="border-red-500"
      />
      <p className="text-sm text-red-600">This field has an error.</p>
    </div>
  ),
};

// With helper text
export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="helper" className="text-sm font-medium">
        Input with Helper
      </label>
      <ComponentName {...args} id="helper" />
      <p className="text-sm text-muted-foreground">
        This is helper text that provides additional context.
      </p>
    </div>
  ),
  args: {
    placeholder: "Enter your information",
  },
};

// Form integration example
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-4">
      <div className="grid items-center gap-1.5">
        <label htmlFor="firstName" className="text-sm font-medium">
          First Name
        </label>
        <ComponentName id="firstName" placeholder="John" />
      </div>
      <div className="grid items-center gap-1.5">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last Name
        </label>
        <ComponentName id="lastName" placeholder="Doe" />
      </div>
      <div className="grid items-center gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <ComponentName id="email" type="email" placeholder="john@example.com" />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Submit
      </button>
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

// With button integration
export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <ComponentName {...args} />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Submit
      </button>
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
