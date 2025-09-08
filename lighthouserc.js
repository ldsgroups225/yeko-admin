module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        "http://localhost:3000",
        "http://localhost:3000/sign-in",
        "http://localhost:3000/forgot-password",
        // Add more URLs as needed
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Lighthouse settings
      settings: {
        // Use desktop preset for consistent results
        preset: "desktop",
        // Disable device emulation for CI
        emulatedFormFactor: "desktop",
        // Throttling settings
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
        ],
      },
    },
    assert: {
      // Performance budgets
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Core Web Vitals
        "first-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],

        // Other important metrics
        "speed-index": ["error", { maxNumericValue: 3000 }],
        interactive: ["error", { maxNumericValue: 3000 }],

        // Accessibility
        "color-contrast": "error",
        "heading-order": "error",
        "html-has-lang": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",

        // SEO
        "document-title": "error",
        "meta-description": "error",
        "http-status-code": "error",
        "crawlable-anchors": "error",

        // Best practices
        "uses-https": "error",
        "uses-http2": "off", // May not be available in CI
        "no-vulnerable-libraries": "error",
        charset: "error",
      },
    },
    upload: {
      // Upload to Lighthouse CI server if configured
      target: "temporary-public-storage",
      // GitHub integration
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
    },
    server: {
      // Local server configuration for CI
      port: 9001,
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: ".lighthouseci/db.sql",
      },
    },
  },
};
