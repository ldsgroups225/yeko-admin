import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Environment and release tracking
  environment: process.env.NODE_ENV || "development",
  release: process.env.npm_package_version || "0.1.0",

  // Server-specific configuration
  beforeSend(event, hint) {
    // Add server context
    event.server_name = process.env.HOSTNAME || "unknown";
    event.tags = {
      ...event.tags,
      runtime: "nodejs",
      platform: process.platform,
      nodeVersion: process.version,
    };

    // Filter out expected errors
    if (event.exception?.values?.[0]?.type === "AbortError") {
      return null;
    }

    // Add request context if available
    if ((hint as any).request) {
      const request = (hint as any).request;
      event.request = {
        url: request.url,
        method: request.method,
        headers: {
          "user-agent": request.headers?.["user-agent"],
          accept: request.headers?.accept,
          "accept-language": request.headers?.["accept-language"],
        },
      };
    }

    return event;
  },

  // Enhanced breadcrumbs for server
  beforeBreadcrumb(breadcrumb, _hint) {
    // Add server-specific context to breadcrumbs
    if (breadcrumb.category === "http") {
      breadcrumb.data = {
        ...breadcrumb.data,
        server: true,
        timestamp: new Date().toISOString(),
      };
    }

    return breadcrumb;
  },

  // Integrations
  integrations: [
    // HTTP integration for tracking API calls
    Sentry.httpIntegration(),
    // Node.js specific integrations
    Sentry.nodeContextIntegration(),
    Sentry.localVariablesIntegration(),
  ],

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Disable in test environment
  enabled:
    process.env.NODE_ENV !== "test" &&
    process.env.NEXT_PUBLIC_SENTRY_DISABLED !== "true",

  // Capture unhandled rejections
  // captureUnhandledRejections: true,

  // Capture uncaught exceptions
  // captureUncaughtException: true, // This option is not available in the current Sentry version
});
