import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring (lower sample rate for edge)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // Environment and release tracking
  environment: process.env.NODE_ENV || "development",
  release: process.env.npm_package_version || "0.1.0",

  // Edge-specific configuration
  beforeSend(event, _hint) {
    // Add edge runtime context
    event.tags = {
      ...event.tags,
      runtime: "edge",
      region: process.env.VERCEL_REGION || "unknown",
    };

    // Filter out edge-specific noise
    if (
      event.exception?.values?.[0]?.value?.includes("Dynamic Code Evaluation")
    ) {
      return null;
    }

    return event;
  },

  // Minimal integrations for edge runtime
  integrations: [
    // Only include integrations that work in edge runtime
  ],

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Disable in test environment
  enabled:
    process.env.NODE_ENV !== "test" &&
    process.env.NEXT_PUBLIC_SENTRY_DISABLED !== "true",
});
