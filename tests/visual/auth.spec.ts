import { expect, test } from "@playwright/test";

test.describe("Authentication Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("sign-in page visual regression", async ({ page }) => {
    await page.goto("/sign-in");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Wait for any animations to complete
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("sign-in-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("sign-in page with form interaction", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    // Fill in the form to test interactive states
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");

    // Take screenshot with filled form
    await expect(page).toHaveScreenshot("sign-in-form-filled.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("forgot-password page visual regression", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("forgot-password-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("auth-code-error page visual regression", async ({ page }) => {
    await page.goto("/auth-code-error");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("auth-code-error-page.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("responsive sign-in page - mobile", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("sign-in-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("responsive sign-in page - tablet", async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("sign-in-tablet.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
