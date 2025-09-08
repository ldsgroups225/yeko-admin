import { expect, test } from "@playwright/test";

test.describe("Users Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Mock authentication
    // await page.context().addCookies([
    //   { name: 'auth-token', value: 'mock-token', domain: 'localhost', path: '/' }
    // ]);
  });

  test("users list page visual regression", async ({ page }) => {
    await page.goto("/users");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Hide dynamic elements
    await page.addStyleTag({
      content: `
        [data-testid="last-login"],
        [data-testid="created-at"],
        .timestamp,
        .user-avatar {
          visibility: hidden !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot("users-list.png", {
      fullPage: true,
      animations: "disabled",
      mask: [page.locator('[data-testid="user-avatar"]')],
    });
  });

  test("users add page visual regression", async ({ page }) => {
    await page.goto("/users/add");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("users-add.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("users form with validation errors", async ({ page }) => {
    await page.goto("/users/add");
    await page.waitForLoadState("networkidle");

    // Try to submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("users-form-validation.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("users form filled state", async ({ page }) => {
    await page.goto("/users/add");
    await page.waitForLoadState("networkidle");

    // Fill form with sample data
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill('input[name="phone"]', "+1234567890");
    await page.selectOption('select[name="role"]', "teacher");

    await expect(page).toHaveScreenshot("users-form-filled.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("users table with filters", async ({ page }) => {
    await page.goto("/users");
    await page.waitForLoadState("networkidle");

    // Apply filters
    await page.selectOption('select[name="role"]', "teacher");
    await page.fill('input[name="search"]', "john");
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("users-filtered.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("users responsive - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/users");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("users-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
