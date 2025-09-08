# Storybook Story Templates and Guidelines

This directory contains standardized templates and guidelines for creating Storybook stories for UI components.

## Templates

### 1. Basic Component Template (`basic-component.stories.tsx`)
Use this template for simple components with minimal props and variants:
- **Components**: Button, Badge, Avatar, Icon, etc.
- **Features**: Basic variants, sizes, states, and comparison stories
- **Focus**: Simple props, visual variants, and basic interactions

### 2. Complex Component Template (`complex-component.stories.tsx`)
Use this template for complex components with multiple sub-components:
- **Components**: Card, Dialog, Modal, Accordion, etc.
- **Features**: Rich content, multiple sections, real-world examples
- **Focus**: Layout, composition, and complex use cases

### 3. Form Component Template (`form-component.stories.tsx`)
Use this template for form-related components:
- **Components**: Input, Select, Checkbox, RadioGroup, Textarea, etc.
- **Features**: Form states, validation, accessibility, labels
- **Focus**: Form integration, validation states, and accessibility

## Story Guidelines

### 1. File Naming
- Use kebab-case for component names: `button.stories.tsx`
- Place stories in the same directory as the component
- Use the pattern: `{component-name}.stories.tsx`

### 2. Story Structure
Every story file should include:

#### Meta Configuration
```typescript
const meta = {
  title: "UI/ComponentName", // Always use UI/ prefix
  component: ComponentName,
  parameters: {
    layout: "centered", // or "padded" for larger components
    docs: {
      description: {
        component: "Clear description of the component's purpose",
      },
    },
    a11y: {
      config: {
        rules: [
          // Include relevant accessibility rules
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

#### Required Stories
Every component should have these basic stories:
- `Default` - Basic usage
- `WithLabel` - If applicable (form components)
- `Disabled` - Disabled state
- `AllVariants` - Show all variants together
- `AllSizes` - Show all sizes together (if applicable)

#### Optional Stories
Add these based on component type:
- `WithIcon` - For components that support icons
- `FormExample` - For form components
- `RealWorldExample` - Complex usage example
- `GridExample` - Multiple components in layout

### 3. Accessibility
Always include:
- `a11y` configuration in parameters
- Proper ARIA labels and roles
- Color contrast rules
- Form-specific rules for form components
- Keyboard navigation support

### 4. Documentation
- Use `tags: ["autodocs"]` for automatic documentation
- Provide clear descriptions for components and stories
- Include usage examples in story descriptions
- Document all props in argTypes

### 5. Controls and Interactions
- Use appropriate control types (select, boolean, text, etc.)
- Include event handlers with `fn()` from `@storybook/test`
- Provide meaningful default values
- Use descriptive control options

### 6. Visual Testing
- Ensure stories work well in visual regression tests
- Use consistent spacing and layout
- Avoid random or time-based content
- Use realistic but static data

## Component Categories

### Basic Components
- Simple, single-purpose components
- Minimal props and variants
- Use `basic-component.stories.tsx` template

### Complex Components
- Multi-part components with sub-components
- Rich content and layouts
- Use `complex-component.stories.tsx` template

### Form Components
- Input and form-related components
- Focus on validation and accessibility
- Use `form-component.stories.tsx` template

## Best Practices

### 1. Story Naming
- Use PascalCase for story names
- Be descriptive: `WithIcon`, `DisabledState`, `FormExample`
- Avoid generic names like `Example1`, `Test`

### 2. Args and Props
- Use `args` for simple prop values
- Use `render` function for complex JSX
- Provide meaningful default values
- Document all props in argTypes

### 3. Layout and Styling
- Use consistent container sizes
- Apply proper spacing and padding
- Use Tailwind classes for styling
- Ensure responsive behavior

### 4. Content
- Use realistic, meaningful content
- Avoid Lorem ipsum when possible
- Include proper semantic HTML
- Use appropriate icons and imagery

### 5. Testing
- Ensure all stories render without errors
- Test keyboard navigation
- Verify accessibility compliance
- Check visual regression tests

## Examples

See the existing story files for reference:
- `src/components/ui/button.stories.tsx` - Basic component example
- `src/components/ui/card.stories.tsx` - Complex component example
- `src/components/ui/input.stories.tsx` - Form component example

## Tools

Use the story generation utility to quickly create new stories:
```bash
bun run storybook:generate --component ComponentName --type basic|complex|form
```

This will create a new story file using the appropriate template with placeholders for your specific component.
