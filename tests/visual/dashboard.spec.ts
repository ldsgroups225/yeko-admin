import { expect, test } from "@playwright/test";

test.describe("Dashboard Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });

    // Mock authentication - you'll need to implement this based on your auth system
    // For now, we'll assume the user needs to be authenticated
    // This might involve setting cookies, localStorage, or other auth tokens

    // Example: Set auth cookies or tokens
    // await page.context().addCookies([
    //   { name: 'auth-token', value: 'mock-token', domain: 'localhost', path: '/' }
    // ]);
  });

  test("dashboard page visual regression", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Wait for any dynamic content to load
    await page.waitForTimeout(1000);

    // Hide dynamic elements that change frequently
    await page.addStyleTag({
      content: `
        [data-testid="current-time"],
        [data-testid="last-updated"],
        .dynamic-timestamp {
          visibility: hidden !important;
        }
      `,
    });

    // Take full page screenshot
    await expect(page).toHaveScreenshot("dashboard-page.png", {
      fullPage: true,
      animations: "disabled",
      mask: [
        // Mask elements that contain dynamic data
        page.locator('[data-testid="user-avatar"]'),
        page.locator(".chart-container"), // If charts have dynamic data
      ],
    });
  });

  test("dashboard sidebar navigation", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Test sidebar expanded state
    await page.locator('[data-testid="sidebar-toggle"]').click();
    await page.waitForTimeout(300); // Wait for animation

    await expect(page).toHaveScreenshot("dashboard-sidebar-expanded.png", {
      animations: "disabled",
    });
  });

  test("dashboard responsive - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dashboard-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("dashboard responsive - tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dashboard-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
