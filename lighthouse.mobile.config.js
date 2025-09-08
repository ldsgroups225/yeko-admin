/**
 * Lighthouse Mobile Configuration
 *
 * This configuration is optimized for mobile performance testing.
 * It uses mobile emulation and stricter performance budgets.
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit on mobile
      url: [
        "http://localhost:3000",
        "http://localhost:3000/sign-in",
        "http://localhost:3000/forgot-password",
        "http://localhost:3000/dashboard",
      ],
      numberOfRuns: 2,
      settings: {
        // Use mobile preset for realistic mobile testing
        preset: "perf",
        emulatedFormFactor: "mobile",
        // Mobile device emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        // Mobile throttling (simulates 3G connection)
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 150 * 3.75,
          downloadThroughputKbps: 1638.4 * 0.9,
          uploadThroughputKbps: 675 * 0.9,
        },
        // Skip PWA audits
        skipAudits: [
          "service-worker",
          "installable-manifest",
          "splash-screen",
          "themed-omnibox",
          "maskable-icon",
          "offline-start-url",
          "apple-touch-icon",
        ],
        // Mobile-specific settings
        onlyCategories: ["performance", "accessibility"],
        logLevel: "info",
      },
    },
    assert: {
      // Stricter mobile performance budgets
      assertions: {
        // Mobile performance is typically lower
        "categories:performance": ["error", { minScore: 0.6 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],

        // Mobile Core Web Vitals (stricter)
        "first-contentful-paint": ["error", { maxNumericValue: 3000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 4000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 600 }],

        // Mobile-specific metrics
        "speed-index": ["error", { maxNumericValue: 4500 }],
        interactive: ["error", { maxNumericValue: 5000 }],
        "first-meaningful-paint": ["error", { maxNumericValue: 3500 }],

        // Mobile accessibility
        "color-contrast": "error",
        "tap-targets": "error", // Mobile-specific
        "heading-order": "error",
        "html-has-lang": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        "button-name": "error",

        // Mobile performance
        "render-blocking-resources": ["warn", { maxNumericValue: 500 }],
        "unused-css-rules": ["warn", { maxNumericValue: 20000 }],
        "unused-javascript": ["warn", { maxNumericValue: 20000 }],
        "modern-image-formats": "warn",
        "uses-optimized-images": "warn",
        "uses-webp-images": "warn",
        "uses-responsive-images": "warn",
        "efficient-animated-content": "warn",
        "offscreen-images": "warn",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/mobile-reports",
    },
    server: {
      port: 9002,
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: ".lighthouseci/mobile-db.sql",
      },
    },
  },
};
