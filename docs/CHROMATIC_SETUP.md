# Chromatic Visual Regression Testing Setup

This document explains how to set up and use Chromatic for visual regression testing with Storybook.

## Overview

Chromatic is a visual testing service that automatically detects visual changes in your UI components by comparing screenshots of your Storybook stories across different builds.

## Setup Instructions

### 1. Create a Chromatic Account

1. Go to [chromatic.com](https://www.chromatic.com/)
2. Sign up with your GitHub account
3. Create a new project and link it to your repository

### 2. Get Your Project Token

1. In your Chromatic project dashboard, go to **Manage** → **Configure**
2. Copy your project token
3. Add it to your GitHub repository secrets as `CHROMATIC_PROJECT_TOKEN`

### 3. GitHub Secrets Configuration

Add the following secret to your GitHub repository:

- `CHROMATIC_PROJECT_TOKEN`: Your Chromatic project token

To add secrets:
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret name and value

## How It Works

### Automatic Testing

- **Pull Requests**: Visual regression tests run automatically on every PR
- **Main Branch**: Builds are automatically accepted as new baselines
- **Draft PRs**: Skipped to save build credits
- **Dependabot PRs**: Skipped to avoid unnecessary builds

### Workflow Triggers

The Chromatic workflow runs on:
- Push to `main` branch
- Pull request events (opened, synchronized, reopened, ready_for_review)

### Build Process

1. **Checkout**: Repository is checked out with full git history
2. **Dependencies**: Bun installs all dependencies
3. **Storybook Build**: Static Storybook is built for testing
4. **Chromatic Upload**: Stories are uploaded and tested
5. **Results**: Visual changes are reported back to the PR

## Manual Usage

### Local Testing

```bash
# Run Chromatic locally (requires CHROMATIC_PROJECT_TOKEN env var)
bun run chromatic

# Run with specific options
bun run chromatic --exit-zero-on-changes
```

### Environment Variables

For local development, create a `.env.local` file:

```bash
CHROMATIC_PROJECT_TOKEN=your_project_token_here
```

## Configuration

### chromatic.config.json

The project includes a Chromatic configuration file with the following settings:

- **Auto-accept changes**: Enabled for main branch
- **File hashing**: Enabled for better performance
- **Skip patterns**: Dependabot branches are skipped
- **Externals**: Public assets are included
- **Compression**: Build artifacts are zipped for faster uploads

### Customization

You can customize the Chromatic behavior by modifying:

1. **chromatic.config.json**: Global project settings
2. **.github/workflows/chromatic.yml**: CI/CD workflow configuration
3. **Individual stories**: Add Chromatic parameters to specific stories

## Story-Level Configuration

You can configure Chromatic behavior for individual stories:

```typescript
// In your story file
export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    chromatic: {
      // Disable this story in Chromatic
      disable: true,
      
      // Add delay before screenshot
      delay: 300,
      
      // Test multiple viewports
      viewports: [320, 1200],
      
      // Ignore specific elements
      ignore: ['.dynamic-content'],
      
      // Force re-capture
      forcedColors: 'active',
    },
  },
} as Meta<typeof Button>
```

## Best Practices

### 1. Story Organization

- Keep stories focused and atomic
- Use consistent naming conventions
- Group related stories together

### 2. Visual Stability

- Avoid dynamic content (dates, random data)
- Use fixed dimensions for containers
- Mock external dependencies

### 3. Performance Optimization

- Use `onlyChanged` for PR builds
- Skip non-visual stories when appropriate
- Optimize story loading times

### 4. Review Process

- Review visual changes carefully in Chromatic dashboard
- Accept intentional changes promptly
- Investigate unexpected changes before merging

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Storybook builds locally first
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Missing Screenshots**
   - Ensure stories are properly exported
   - Check for console errors in Storybook
   - Verify story parameters are correct

3. **False Positives**
   - Use `chromatic.ignore` for dynamic elements
   - Add delays for animations
   - Consider viewport-specific issues

### Debug Commands

```bash
# Build Storybook locally to test
bun run build-storybook

# Run Chromatic with debug output
bun run chromatic --debug

# Test specific stories
bun run chromatic --only-story-names="Button/*"
```

## Monitoring and Maintenance

### Build Credits

- Monitor your Chromatic build usage
- Optimize builds to stay within limits
- Consider upgrading plan if needed

### Baseline Management

- Baselines are automatically updated on main branch
- Manual baseline updates can be done in Chromatic dashboard
- Old baselines are automatically cleaned up

### Performance Monitoring

- Track build times and optimize as needed
- Monitor for flaky tests and address root causes
- Review visual change patterns for insights

## Integration with Other Tools

### Storybook Addons

Chromatic works seamlessly with:
- `@storybook/addon-a11y`: Accessibility testing
- `@storybook/addon-docs`: Documentation
- `@storybook/addon-vitest`: Unit testing

### CI/CD Integration

The workflow integrates with:
- GitHub Actions for automation
- Pull request comments for visibility
- Branch protection rules for quality gates

## Support and Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Storybook Visual Testing Guide](https://storybook.js.org/docs/writing-tests/visual-testing)
- [GitHub Actions Integration](https://www.chromatic.com/docs/github-actions)