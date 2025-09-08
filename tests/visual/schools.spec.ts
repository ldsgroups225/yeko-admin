import { expect, test } from "@playwright/test";

test.describe("Schools Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Mock authentication
    // await page.context().addCookies([
    //   { name: 'auth-token', value: 'mock-token', domain: 'localhost', path: '/' }
    // ]);
  });

  test("schools list page visual regression", async ({ page }) => {
    await page.goto("/schools");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Hide dynamic elements
    await page.addStyleTag({
      content: `
        [data-testid="last-updated"],
        [data-testid="created-at"],
        .timestamp {
          visibility: hidden !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot("schools-list.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("schools add page visual regression", async ({ page }) => {
    await page.goto("/schools/add");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("schools-add.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("schools form with validation errors", async ({ page }) => {
    await page.goto("/schools/add");
    await page.waitForLoadState("networkidle");

    // Try to submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("schools-form-validation.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("schools form filled state", async ({ page }) => {
    await page.goto("/schools/add");
    await page.waitForLoadState("networkidle");

    // Fill form with sample data
    await page.fill('input[name="name"]', "Test School");
    await page.fill('input[name="address"]', "123 Test Street");
    await page.fill('input[name="phone"]', "+1234567890");
    await page.fill('input[name="email"]', "test@school.com");

    await expect(page).toHaveScreenshot("schools-form-filled.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("schools responsive - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/schools");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("schools-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
