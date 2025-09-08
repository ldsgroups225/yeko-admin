# Component Documentation Guide

This guide provides comprehensive instructions for creating and maintaining component documentation in Storybook.

## Overview

Our Storybook setup includes:
- **Standardized templates** for different component types
- **Automated story generation** utilities
- **Accessibility testing** integration
- **Visual regression testing** support
- **Comprehensive documentation** guidelines

## Quick Start

### 1. Generate a New Story
```bash
# Basic component (Button, Badge, Avatar, etc.)
bun run storybook:generate --component=Badge --type=basic

# Complex component (Card, Dialog, Modal, etc.)
bun run storybook:generate --component=Dialog --type=complex

# Form component (Input, Select, Checkbox, etc.)
bun run storybook:generate --component=Select --type=form
```

### 2. Customize the Generated Story
1. Update the component import path
2. Customize argTypes for your component's props
3. Add component-specific stories
4. Update descriptions and documentation

### 3. Test in Storybook
```bash
bun run storybook
```

## Component Categories

### Basic Components
**Use for**: Simple, single-purpose components with minimal props

**Examples**: Button, Badge, Avatar, Icon, Spinner

**Template Features**:
- Basic variants and sizes
- State management (disabled, loading)
- Icon integration
- Comparison stories (AllVariants, AllSizes)

**Required Stories**:
- `Default` - Basic usage
- `Secondary` - Alternative variant
- `Small/Large` - Size variants
- `Disabled` - Disabled state
- `WithIcon` - Icon integration
- `AllVariants` - All variants comparison
- `AllSizes` - All sizes comparison

### Complex Components
**Use for**: Multi-part components with sub-components and rich content

**Examples**: Card, Dialog, Modal, Accordion, Table, Navigation

**Template Features**:
- Multiple sections (header, content, footer)
- Rich content examples
- Real-world usage patterns
- Grid layouts
- Complex interactions

**Required Stories**:
- `Default` - Basic usage
- `WithHeader` - Header section
- `WithFooter` - Footer section
- `ComplexExample` - Rich content
- `RealWorldExample` - Production-like usage
- `GridExample` - Multiple components layout

### Form Components
**Use for**: Input and form-related components

**Examples**: Input, Select, Checkbox, RadioGroup, Textarea, Switch

**Template Features**:
- Form integration
- Validation states
- Accessibility features
- Label integration
- Helper text support

**Required Stories**:
- `Default` - Basic usage
- `WithLabel` - Label integration
- `Email/Password/Number` - Input types
- `Disabled` - Disabled state
- `Required` - Required field
- `ValidState/InvalidState` - Validation
- `WithHelperText` - Helper text
- `FormExample` - Complete form
- `WithButton` - Button integration

## Story Structure

### Meta Configuration
```typescript
const meta = {
  title: "UI/ComponentName", // Always use UI/ prefix
  component: ComponentName,
  parameters: {
    layout: "centered", // or "padded" for larger components
    docs: {
      description: {
        component: "Clear, concise description of the component's purpose and usage.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          // Add component-specific accessibility rules
        ],
      },
    },
  },
  tags: ["autodocs"], // Always include for documentation
  argTypes: {
    // Define all component props with descriptions
  },
} satisfies Meta<typeof ComponentName>;
```

### Story Definition
```typescript
export const StoryName: Story = {
  args: {
    // Simple prop values
  },
  render: (args) => (
    // Complex JSX for custom rendering
  ),
  parameters: {
    docs: {
      description: {
        story: "Description of what this story demonstrates.",
      },
    },
  },
};
```

## Accessibility Guidelines

### Required Accessibility Rules
All components should include these basic accessibility rules:

```typescript
a11y: {
  config: {
    rules: [
      {
        id: "color-contrast",
        enabled: true,
      },
    ],
  },
},
```

### Form Component Accessibility
Form components should include additional rules:

```typescript
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
    ],
  },
},
```

### Accessibility Best Practices
1. **Labels**: Always provide proper labels for form components
2. **ARIA**: Use appropriate ARIA attributes
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Color Contrast**: Maintain sufficient color contrast
5. **Screen Readers**: Test with screen readers

## Documentation Standards

### Component Description
- **Purpose**: What the component does
- **Usage**: When to use it
- **Props**: Key props and their purposes
- **Examples**: Common usage patterns

### Story Descriptions
- **What**: What the story demonstrates
- **When**: When to use this pattern
- **Why**: Why this approach is recommended

### Code Examples
- Use realistic, meaningful content
- Include proper semantic HTML
- Show integration with other components
- Demonstrate best practices

## Testing Guidelines

### Visual Testing
- Use consistent layouts and spacing
- Avoid random or time-based content
- Use realistic but static data
- Ensure stories work in visual regression tests

### Accessibility Testing
- Run accessibility audits in Storybook
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios

### Interaction Testing
- Test all interactive elements
- Verify event handlers work correctly
- Test form validation and submission
- Ensure proper focus management

## Common Patterns

### Variant Comparison
```typescript
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Component variant="default">Default</Component>
      <Component variant="secondary">Secondary</Component>
      <Component variant="destructive">Destructive</Component>
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
```

### Size Comparison
```typescript
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Component size="sm">Small</Component>
      <Component size="default">Default</Component>
      <Component size="lg">Large</Component>
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
```

### Form Integration
```typescript
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-4">
      <div className="grid items-center gap-1.5">
        <label htmlFor="field" className="text-sm font-medium">
          Field Label
        </label>
        <Component id="field" placeholder="Enter value..." />
      </div>
      <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">
        Submit
      </button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete form example showing proper integration.",
      },
    },
  },
};
```

## Maintenance

### Regular Updates
- Review and update stories when components change
- Update documentation when new props are added
- Refresh examples with current best practices
- Update accessibility rules as needed

### Quality Checks
- Ensure all stories render without errors
- Verify accessibility compliance
- Check visual regression tests
- Update documentation for clarity

### Version Control
- Commit story changes with component updates
- Use descriptive commit messages
- Tag releases with story updates
- Maintain changelog for breaking changes

## Tools and Commands

### Development
```bash
# Start Storybook
bun run storybook

# Build Storybook
bun run build-storybook

# Run Storybook tests
bun run storybook:test
```

### Story Generation
```bash
# Generate basic component story
bun run storybook:generate --component=Badge --type=basic

# Generate complex component story
bun run storybook:generate --component=Dialog --type=complex

# Generate form component story
bun run storybook:generate --component=Select --type=form
```

### Visual Testing
```bash
# Run visual tests
bun run test:visual

# Update visual snapshots
bun run test:visual:update

# Debug visual tests
bun run test:visual:debug
```

## Troubleshooting

### Common Issues

#### Story Not Rendering
- Check component import path
- Verify component exports
- Check for TypeScript errors
- Ensure proper props are passed

#### Accessibility Warnings
- Review accessibility rules configuration
- Check ARIA attributes
- Verify label associations
- Test keyboard navigation

#### Visual Test Failures
- Check for dynamic content
- Verify consistent styling
- Update snapshots if changes are intentional
- Review layout and spacing

### Getting Help
- Check existing story examples
- Review Storybook documentation
- Consult accessibility guidelines
- Ask team members for guidance

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Accessibility Testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Visual Testing](https://storybook.js.org/docs/writing-tests/visual-testing)
- [Component Documentation](https://storybook.js.org/docs/writing-docs/introduction)
