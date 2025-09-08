import { test } from "@playwright/test";
import {
  fillFormWithTestData,
  hideDynamicElements,
  mockAuthentication,
  setupVisualTest,
  takeVisualScreenshot,
  VIEWPORTS,
  waitForVisualReady,
} from "../utils/visual-helpers";

test.describe("Critical User Journeys Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualTest(page);
  });

  test("complete authentication flow", async ({ page }) => {
    // Step 1: Landing on sign-in page
    await page.goto("/sign-in");
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-auth-01-signin.png");

    // Step 2: Fill in credentials
    await fillFormWithTestData(page, {
      email: "test@example.com",
      password: "password123",
    });
    await takeVisualScreenshot(page, "journey-auth-02-filled.png");

    // Step 3: Navigate to forgot password
    await page.click('a[href="/forgot-password"]');
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-auth-03-forgot-password.png");

    // Step 4: Fill forgot password form
    await fillFormWithTestData(page, {
      email: "test@example.com",
    });
    await takeVisualScreenshot(page, "journey-auth-04-forgot-filled.png");
  });

  test("dashboard to school management flow", async ({ page }) => {
    // Mock authentication for this test
    await mockAuthentication(page);

    // Step 1: Dashboard overview
    await page.goto("/dashboard");
    await waitForVisualReady(page);
    await hideDynamicElements(page);
    await takeVisualScreenshot(page, "journey-school-01-dashboard.png");

    // Step 2: Navigate to schools
    await page.click('a[href="/schools"]');
    await waitForVisualReady(page);
    await hideDynamicElements(page);
    await takeVisualScreenshot(page, "journey-school-02-schools-list.png");

    // Step 3: Add new school
    await page.click('a[href="/schools/add"]');
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-school-03-add-form.png");

    // Step 4: Fill school form
    await fillFormWithTestData(page, {
      name: "Test Elementary School",
      address: "123 Education Street",
      phone: "+1234567890",
      email: "contact@testelemschool.edu",
    });
    await takeVisualScreenshot(page, "journey-school-04-form-filled.png");
  });

  test("user management workflow", async ({ page }) => {
    await mockAuthentication(page);

    // Step 1: Navigate to users from dashboard
    await page.goto("/dashboard");
    await waitForVisualReady(page);
    await page.click('a[href="/users"]');
    await waitForVisualReady(page);
    await hideDynamicElements(page);
    await takeVisualScreenshot(page, "journey-users-01-list.png");

    // Step 2: Filter users
    await page.selectOption('select[name="role"]', "teacher");
    await page.fill('input[name="search"]', "john");
    await page.waitForTimeout(500);
    await takeVisualScreenshot(page, "journey-users-02-filtered.png");

    // Step 3: Add new user
    await page.click('a[href="/users/add"]');
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-users-03-add-form.png");

    // Step 4: Fill user form
    await fillFormWithTestData(page, {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@school.edu",
      phone: "+1987654321",
      role: "teacher",
    });
    await takeVisualScreenshot(page, "journey-users-04-form-filled.png");
  });

  test("settings and configuration flow", async ({ page }) => {
    await mockAuthentication(page);

    // Step 1: Navigate to settings
    await page.goto("/settings");
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-settings-01-main.png");

    // Step 2: Test different settings tabs/sections
    const settingsSections = [
      { selector: '[data-testid="profile-settings"]', name: "profile" },
      { selector: '[data-testid="school-settings"]', name: "school" },
      {
        selector: '[data-testid="notification-settings"]',
        name: "notifications",
      },
    ];

    for (const section of settingsSections) {
      const element = page.locator(section.selector);
      if ((await element.count()) > 0) {
        await element.click();
        await page.waitForTimeout(300);
        await takeVisualScreenshot(
          page,
          `journey-settings-02-${section.name}.png`,
        );
      }
    }
  });

  test("responsive user journey - mobile", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await mockAuthentication(page);

    // Mobile navigation flow
    await page.goto("/dashboard");
    await waitForVisualReady(page);
    await hideDynamicElements(page);
    await takeVisualScreenshot(page, "journey-mobile-01-dashboard.png");

    // Open mobile menu
    const menuButton = page.locator('[data-testid="mobile-menu-button"]');
    if ((await menuButton.count()) > 0) {
      await menuButton.click();
      await page.waitForTimeout(300);
      await takeVisualScreenshot(page, "journey-mobile-02-menu-open.png");

      // Navigate to schools via mobile menu
      await page.click('a[href="/schools"]');
      await waitForVisualReady(page);
      await takeVisualScreenshot(page, "journey-mobile-03-schools.png");
    }
  });

  test("error states and edge cases", async ({ page }) => {
    // Test 404 page
    await page.goto("/non-existent-page");
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-error-01-404.png");

    // Test auth code error
    await page.goto("/auth-code-error");
    await waitForVisualReady(page);
    await takeVisualScreenshot(page, "journey-error-02-auth-code.png");

    // Test form validation errors
    await page.goto("/sign-in");
    await waitForVisualReady(page);

    // Submit empty form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await takeVisualScreenshot(page, "journey-error-03-validation.png");

    // Test invalid email format
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await takeVisualScreenshot(page, "journey-error-04-invalid-email.png");
  });

  test("loading and transition states", async ({ page }) => {
    await mockAuthentication(page);

    // Test loading states by intercepting network requests
    await page.route("**/api/**", (route) => {
      // Delay API responses to capture loading states
      setTimeout(() => route.continue(), 1000);
    });

    await page.goto("/dashboard");

    // Capture loading state
    await page.waitForTimeout(200);
    await takeVisualScreenshot(page, "journey-loading-01-dashboard.png");

    // Wait for content to load
    await waitForVisualReady(page, 1500);
    await hideDynamicElements(page);
    await takeVisualScreenshot(page, "journey-loading-02-loaded.png");
  });

  test("theme variations", async ({ page }) => {
    const themes = ["light", "dark"] as const;

    for (const theme of themes) {
      // Set theme
      await page.addInitScript((theme) => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
      }, theme);

      await page.goto("/sign-in");
      await waitForVisualReady(page);
      await takeVisualScreenshot(page, `journey-theme-signin-${theme}.png`);

      // Test dashboard with theme
      await mockAuthentication(page);
      await page.goto("/dashboard");
      await waitForVisualReady(page);
      await hideDynamicElements(page);
      await takeVisualScreenshot(page, `journey-theme-dashboard-${theme}.png`);
    }
  });
});
