/**
 * Lighthouse Configuration for Local Development
 *
 * This configuration is optimized for local development and testing.
 * It includes more lenient thresholds and additional debugging options.
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit in development
      url: [
        "http://localhost:3000",
        "http://localhost:3000/sign-in",
        "http://localhost:3000/forgot-password",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/schools",
        "http://localhost:3000/users",
        "http://localhost:3000/settings",
      ],
      // Fewer runs for faster local testing
      numberOfRuns: 1,
      // Lighthouse settings for development
      settings: {
        // Use desktop preset
        preset: "desktop",
        emulatedFormFactor: "desktop",
        // More lenient throttling for local development
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        // Skip PWA audits for admin dashboard
        skipAudits: [
          "service-worker",
          "installable-manifest",
          "splash-screen",
          "themed-omnibox",
          "maskable-icon",
          "offline-start-url",
          "apple-touch-icon",
          "pwa-cross-browser",
          "pwa-page-transitions",
          "pwa-each-page-has-url",
        ],
        // Additional settings for development
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        // Disable some checks that might be flaky in development
        disableStorageReset: false,
        // Enable more detailed logging
        logLevel: "info",
      },
    },
    assert: {
      // More lenient assertions for development
      assertions: {
        // Category scores (more lenient for development)
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],

        // Core Web Vitals (more lenient)
        "first-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.15 }],
        "total-blocking-time": ["warn", { maxNumericValue: 400 }],

        // Other performance metrics
        "speed-index": ["warn", { maxNumericValue: 3500 }],
        interactive: ["warn", { maxNumericValue: 3500 }],
        "first-meaningful-paint": ["warn", { maxNumericValue: 2500 }],

        // Accessibility (strict)
        "color-contrast": "error",
        "heading-order": "error",
        "html-has-lang": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",
        "button-name": "error",
        "aria-allowed-attr": "error",
        "aria-required-attr": "error",
        "aria-valid-attr-value": "error",
        "aria-valid-attr": "error",

        // SEO
        "document-title": "error",
        "meta-description": "warn",
        "http-status-code": "error",
        "crawlable-anchors": "warn",
        "robots-txt": "warn",
        hreflang: "off", // Not applicable for admin dashboard

        // Best practices
        "uses-https": "off", // Not applicable for localhost
        "no-vulnerable-libraries": "error",
        charset: "error",
        doctype: "error",
        "no-document-write": "error",
        "external-anchors-use-rel-noopener": "warn",
        "geolocation-on-start": "error",
        "notification-on-start": "error",
      },
    },
    upload: {
      // Don't upload results in development
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: ".lighthouseci/db.sql",
      },
    },
  },
};
