import type { ChromaticConfig } from "@chromatic-com/playwright";
import { defineConfig, devices } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<ChromaticConfig>({
  testDir: "./tests",
  // Look for files with the .spec.js or .e2e.js extension
  testMatch: "*.@(spec|e2e).?(c|m)[jt]s?(x)",
  // Timeout per test, test running locally are slower due to database connections with PGLite
  timeout: process.env.CI ? 30 * 1000 : 60 * 1000,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: process.env.CI ? "github" : "list",

  expect: {
    // Set timeout for async expect matchers
    timeout: 20 * 1000,
    // Configure visual comparison settings
    toHaveScreenshot: {
      // Threshold for pixel differences (0-1)
      threshold: 0.2,
      // Animation handling
      animations: "disabled",
      // Maximum allowed pixel difference
      maxDiffPixels: 100,
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 100,
    },
  },

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: process.env.CI ? "bun run start" : "bun run dev:next",
    url: baseURL,
    timeout: 2 * 60 * 1000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SENTRY_DISABLED: "true",
    },
  },

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: process.env.CI ? "on" : "retain-on-failure",

    // Record videos when retrying the failed test.
    video: process.env.CI ? "retain-on-failure" : undefined,

    // Screenshot settings for visual testing
    screenshot: process.env.CI ? "only-on-failure" : "off",

    // Disable automatic screenshots at test completion when using Chromatic test fixture.
    disableAutoSnapshot: true,

    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,

    // Set default viewport for consistent visual testing
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    ...(process.env.CI
      ? [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
        ]
      : []),
  ],
});
