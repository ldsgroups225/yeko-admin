import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Visual testing utilities for Playwright
 */

export interface VisualTestOptions {
  /** Whether to take a full page screenshot */
  fullPage?: boolean;
  /** Whether to disable animations */
  animations?: "disabled" | "allow";
  /** Elements to mask in the screenshot */
  mask?: Locator[];
  /** Clip area for the screenshot */
  clip?: { x: number; y: number; width: number; height: number };
  /** Threshold for pixel differences (0-1) */
  threshold?: number;
  /** Maximum allowed pixel difference */
  maxDiffPixels?: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
} as const;

/**
 * Set up page for visual testing with consistent settings
 */
export async function setupVisualTest(
  page: Page,
  viewport: ViewportSize = VIEWPORTS.desktop,
) {
  await page.setViewportSize(viewport);

  // Disable animations globally for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Hide dynamic elements that change frequently
 */
export async function hideDynamicElements(
  page: Page,
  selectors: string[] = [],
) {
  const defaultSelectors = [
    '[data-testid="current-time"]',
    '[data-testid="last-updated"]',
    '[data-testid="timestamp"]',
    ".dynamic-timestamp",
    ".last-login",
    ".created-at",
    ".updated-at",
  ];

  const allSelectors = [...defaultSelectors, ...selectors];

  await page.addStyleTag({
    content: `
      ${allSelectors.join(", ")} {
        visibility: hidden !important;
      }
    `,
  });
}

/**
 * Wait for page to be ready for visual testing
 */
export async function waitForVisualReady(
  page: Page,
  additionalWait: number = 500,
) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(additionalWait);
}

/**
 * Take a visual regression screenshot with consistent settings
 */
export async function takeVisualScreenshot(
  page: Page,
  name: string,
  options: VisualTestOptions = {},
) {
  const defaultOptions: VisualTestOptions = {
    fullPage: true,
    animations: "disabled",
    threshold: 0.2,
    maxDiffPixels: 100,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  await expect(page).toHaveScreenshot(name, mergedOptions);
}

/**
 * Test multiple viewports for responsive design
 */
export async function testResponsiveScreenshots(
  page: Page,
  url: string,
  baseName: string,
  viewports: Array<{ name: string; size: ViewportSize }> = [
    { name: "mobile", size: VIEWPORTS.mobile },
    { name: "tablet", size: VIEWPORTS.tablet },
    { name: "desktop", size: VIEWPORTS.desktop },
  ],
) {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport.size);
    await page.goto(url);
    await waitForVisualReady(page);

    await takeVisualScreenshot(page, `${baseName}-${viewport.name}.png`);
  }
}

/**
 * Mock authentication for protected routes
 */
export async function mockAuthentication(_page: Page) {
  // This is a placeholder - implement based on your authentication system
  // Examples:

  // Option 1: Set cookies
  // await page.context().addCookies([
  //   { name: 'auth-token', value: 'mock-token', domain: 'localhost', path: '/' }
  // ]);

  // Option 2: Set localStorage
  // await page.addInitScript(() => {
  //   localStorage.setItem('auth-token', 'mock-token');
  // });

  // Option 3: Set sessionStorage
  // await page.addInitScript(() => {
  //   sessionStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));
  // });

  console.log(
    "Authentication mocking not implemented - add your auth logic here",
  );
}

/**
 * Fill form with test data
 */
export async function fillFormWithTestData(
  page: Page,
  formData: Record<string, string>,
) {
  for (const [field, value] of Object.entries(formData)) {
    const selector = `input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`;
    const element = page.locator(selector);

    if ((await element.count()) > 0) {
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === "select") {
        await element.selectOption(value);
      } else {
        await element.fill(value);
      }
    }
  }
}

/**
 * Test form validation states
 */
export async function testFormValidation(
  page: Page,
  submitSelector: string = 'button[type="submit"]',
  screenshotName: string = "form-validation.png",
) {
  // Try to submit empty form to trigger validation
  await page.click(submitSelector);
  await page.waitForTimeout(500);

  await takeVisualScreenshot(page, screenshotName);
}

/**
 * Test component states (hover, focus, active, etc.)
 */
export async function testComponentStates(
  page: Page,
  selector: string,
  baseName: string,
  states: Array<"hover" | "focus" | "active"> = ["hover", "focus"],
) {
  const element = page.locator(selector);

  // Default state
  await takeVisualScreenshot(page, `${baseName}-default.png`);

  for (const state of states) {
    switch (state) {
      case "hover":
        await element.hover();
        await page.waitForTimeout(100);
        await takeVisualScreenshot(page, `${baseName}-hover.png`);
        break;

      case "focus":
        await element.focus();
        await page.waitForTimeout(100);
        await takeVisualScreenshot(page, `${baseName}-focus.png`);
        break;

      case "active":
        await element.click();
        await page.waitForTimeout(100);
        await takeVisualScreenshot(page, `${baseName}-active.png`);
        break;
    }
  }
}

/**
 * Compare screenshots with custom threshold
 */
export async function compareWithThreshold(
  page: Page,
  name: string,
  threshold: number = 0.2,
) {
  await expect(page).toHaveScreenshot(name, {
    threshold,
    animations: "disabled",
  });
}

/**
 * Test dark/light theme variations
 */
export async function testThemeVariations(
  page: Page,
  url: string,
  baseName: string,
  themes: Array<"light" | "dark"> = ["light", "dark"],
) {
  for (const theme of themes) {
    // Set theme - adjust based on your theme implementation
    await page.addInitScript((theme) => {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }, theme);

    await page.goto(url);
    await waitForVisualReady(page);

    await takeVisualScreenshot(page, `${baseName}-${theme}.png`);
  }
}
