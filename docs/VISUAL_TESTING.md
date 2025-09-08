# Visual Regression Testing with Playwright

This document explains how to use Playwright for visual regression testing in the project.

## Overview

Visual regression testing automatically detects unintended visual changes in your application by comparing screenshots of your pages across different builds. This helps catch UI bugs, layout issues, and unintended design changes.

## Setup

### Prerequisites

1. **Playwright Installation**: Already configured in the project
2. **Browser Installation**: Run `bun run visual:install` to install browsers
3. **Test Environment**: Ensure your development server can run

### Initial Setup

```bash
# Check setup
bun run visual:check

# Install browsers (if needed)
bunx playwright install

# Run initial tests to create baselines
bun run test:visual:update
```

## Test Structure

### Test Organization

```
tests/
├── visual/
│   ├── auth.spec.ts           # Authentication pages
│   ├── dashboard.spec.ts      # Dashboard and main app
│   ├── schools.spec.ts        # School management
│   ├── users.spec.ts          # User management
│   └── user-journeys.spec.ts  # Complete user flows
└── utils/
    └── visual-helpers.ts      # Testing utilities
```

### Test Categories

1. **Page-Level Tests**: Test individual pages for visual consistency
2. **Component Tests**: Test specific UI components in isolation
3. **User Journey Tests**: Test complete workflows and interactions
4. **Responsive Tests**: Test different viewport sizes
5. **Theme Tests**: Test light/dark theme variations

## Running Tests

### Basic Commands

```bash
# Run all visual tests
bun run test:visual

# Run specific test file
bun run test:visual auth.spec.ts

# Run tests matching a pattern
bunx playwright test --grep "sign-in"

# Run tests in headed mode (see browser)
bun run test:visual:headed

# Run tests in debug mode
bun run test:visual:debug
```

### Advanced Commands

```bash
# Run tests for specific browser
bunx playwright test --project chromium

# Run with specific number of workers
bunx playwright test --workers 2

# Run tests and update snapshots
bun run test:visual:update

# Generate and view test report
bun run test:visual:report
```

### Helper Scripts

```bash
# Use the visual testing manager
bun run visual:setup

# Check configuration
bun run visual:check

# Run tests with options
bun run visual:test --grep "dashboard"

# Update baselines
bun run visual:update
```

## Writing Visual Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { setupVisualTest, takeVisualScreenshot } from '../utils/visual-helpers';

test.describe('My Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTest(page);
  });

  test('component default state', async ({ page }) => {
    await page.goto('/my-page');
    await page.waitForLoadState('networkidle');
    
    await takeVisualScreenshot(page, 'my-component-default.png');
  });
});
```

### Using Visual Helpers

```typescript
import {
  setupVisualTest,
  waitForVisualReady,
  takeVisualScreenshot,
  hideDynamicElements,
  testResponsiveScreenshots,
  fillFormWithTestData,
  VIEWPORTS,
} from '../utils/visual-helpers';

test('responsive design test', async ({ page }) => {
  await testResponsiveScreenshots(
    page,
    '/my-page',
    'my-page',
    [
      { name: 'mobile', size: VIEWPORTS.mobile },
      { name: 'desktop', size: VIEWPORTS.desktop },
    ]
  );
});
```

### Handling Dynamic Content

```typescript
test('page with dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  await waitForVisualReady(page);
  
  // Hide elements that change frequently
  await hideDynamicElements(page, [
    '[data-testid="current-time"]',
    '.user-avatar',
  ]);
  
  // Mask specific elements
  await takeVisualScreenshot(page, 'dashboard.png', {
    mask: [
      page.locator('[data-testid="dynamic-chart"]'),
    ],
  });
});
```

## Configuration

### Playwright Configuration

The `playwright.config.ts` includes visual testing optimizations:

```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2,           // 20% pixel difference threshold
    animations: 'disabled',   // Disable animations
    maxDiffPixels: 100,      // Maximum allowed pixel differences
  },
},
use: {
  viewport: { width: 1280, height: 720 },  // Consistent viewport
  reducedMotion: 'reduce',                  // Reduce animations
},
```

### Custom Configuration

You can override settings per test:

```typescript
await expect(page).toHaveScreenshot('my-test.png', {
  threshold: 0.1,        // Stricter threshold
  maxDiffPixels: 50,     // Fewer allowed differences
  fullPage: true,        // Full page screenshot
  animations: 'allow',   // Allow animations
});
```

## Best Practices

### 1. Consistent Test Environment

- Use consistent viewport sizes
- Disable animations for stability
- Hide or mask dynamic content
- Wait for content to load completely

### 2. Meaningful Test Names

```typescript
// Good
test('sign-in form with validation errors', async ({ page }) => {
  // ...
});

// Bad
test('test1', async ({ page }) => {
  // ...
});
```

### 3. Organize Screenshots

- Use descriptive filenames
- Group related screenshots
- Include state information in names

```typescript
// Good naming
await takeVisualScreenshot(page, 'dashboard-sidebar-collapsed.png');
await takeVisualScreenshot(page, 'user-form-validation-errors.png');

// Bad naming
await takeVisualScreenshot(page, 'test1.png');
await takeVisualScreenshot(page, 'screenshot.png');
```

### 4. Handle Dynamic Content

```typescript
// Hide timestamps and dynamic data
await hideDynamicElements(page, [
  '[data-testid="timestamp"]',
  '.last-updated',
  '.dynamic-content',
]);

// Mask user-specific content
await takeVisualScreenshot(page, 'page.png', {
  mask: [
    page.locator('[data-testid="user-avatar"]'),
    page.locator('.personal-info'),
  ],
});
```

### 5. Test Multiple States

```typescript
test('button states', async ({ page }) => {
  await page.goto('/buttons');
  
  // Default state
  await takeVisualScreenshot(page, 'button-default.png');
  
  // Hover state
  await page.hover('button');
  await takeVisualScreenshot(page, 'button-hover.png');
  
  // Focus state
  await page.focus('button');
  await takeVisualScreenshot(page, 'button-focus.png');
});
```

## Baseline Management

### Creating Baselines

```bash
# Create initial baselines
bun run test:visual:update

# Update specific test baselines
bunx playwright test auth.spec.ts --update-snapshots
```

### Reviewing Changes

1. **Run Tests**: Execute visual tests to detect changes
2. **Review Differences**: Check the test report for visual diffs
3. **Approve Changes**: Update baselines if changes are intentional
4. **Investigate Issues**: Fix unexpected visual changes

### Baseline Storage

- Screenshots are stored in `tests/visual/*.spec.ts-snapshots/`
- Organize by browser and test file
- Commit baselines to version control
- Review baseline changes in pull requests

## CI/CD Integration

### GitHub Actions

Visual tests run automatically in CI:

```yaml
- name: Run Visual Tests
  run: bunx playwright test tests/visual/
  
- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

### Handling CI Failures

1. **Review Test Report**: Download and examine the report
2. **Check Differences**: Look for unexpected visual changes
3. **Update Baselines**: If changes are intentional
4. **Fix Issues**: Address any real visual bugs

## Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Increase wait times
   - Hide dynamic content
   - Use consistent viewport sizes
   - Disable animations

2. **Font Rendering Differences**
   - Use web fonts consistently
   - Set font loading strategies
   - Consider font fallbacks

3. **Browser Differences**
   - Test on multiple browsers
   - Use browser-specific baselines
   - Account for rendering differences

4. **Performance Issues**
   - Reduce test parallelization
   - Optimize test setup
   - Use smaller viewports when possible

### Debug Commands

```bash
# Run single test in debug mode
bunx playwright test auth.spec.ts --debug

# Run with browser visible
bunx playwright test --headed

# Generate detailed report
bunx playwright test --reporter=html

# Analyze screenshot differences
bun run visual:analyze
```

### Environment Issues

```bash
# Check setup
bun run visual:check

# Reinstall browsers
bunx playwright install --force

# Clear old results
rm -rf test-results/ playwright-report/
```

## Performance Optimization

### Test Execution

- Run tests in parallel (default)
- Use appropriate worker count
- Skip unnecessary tests in development

### Screenshot Optimization

- Use appropriate thresholds
- Limit full-page screenshots
- Optimize viewport sizes
- Cache test data when possible

### CI Optimization

- Use matrix builds for multiple browsers
- Cache browser installations
- Parallelize test execution
- Upload artifacts only on failure

## Integration with Other Tools

### Storybook Integration

Visual tests complement Storybook:
- Storybook: Component isolation and documentation
- Playwright: Full page and user journey testing

### Chromatic Integration

Both tools serve different purposes:
- Chromatic: Storybook-based visual testing
- Playwright: Full application visual testing

### Development Workflow

1. **Component Development**: Use Storybook for isolated development
2. **Integration Testing**: Use Playwright for full page testing
3. **User Journey Testing**: Use Playwright for complete workflows
4. **Regression Testing**: Both tools for comprehensive coverage

## Maintenance

### Regular Tasks

- Review and update baselines monthly
- Clean up old test artifacts
- Update browser versions
- Optimize test performance

### Monitoring

- Track test execution times
- Monitor failure rates
- Review visual change patterns
- Update test coverage as needed

## Resources

- [Playwright Visual Testing Guide](https://playwright.dev/docs/test-screenshots)
- [Visual Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Test Reporters](https://playwright.dev/docs/test-reporters)