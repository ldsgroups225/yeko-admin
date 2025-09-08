import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session replay for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment and release tracking
  environment: process.env.NODE_ENV || "development",
  release: process.env.npm_package_version || "0.1.0",

  // Enhanced error filtering
  beforeSend(event, hint) {
    // Filter out development-only errors
    if (process.env.NODE_ENV === "development") {
      // Skip HMR and development-specific errors
      if (event.exception?.values?.[0]?.value?.includes("ChunkLoadError")) {
        return null;
      }
      if (event.exception?.values?.[0]?.value?.includes("Loading chunk")) {
        return null;
      }
    }

    // Filter out network errors that are not actionable
    if (event.exception?.values?.[0]?.type === "NetworkError") {
      return null;
    }

    // Add user context if available
    const user = getCurrentUser(); // You'll need to implement this
    if (user && typeof user === "object" && "id" in user) {
      event.user = {
        id: (user as { id: string }).id,
        email: (user as { email?: string }).email,
        username: (user as { username?: string }).username,
      };
    }

    // Add additional context
    event.tags = {
      ...event.tags,
      component: (hint.originalException as { componentStack?: string })
        ?.componentStack
        ? "React"
        : "JavaScript",
    };

    return event;
  },

  // Enhanced breadcrumbs
  beforeBreadcrumb(breadcrumb, _hint) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === "console" && breadcrumb.level === "debug") {
      return null;
    }

    // Enhance navigation breadcrumbs
    if (breadcrumb.category === "navigation") {
      breadcrumb.data = {
        ...breadcrumb.data,
        timestamp: new Date().toISOString(),
      };
    }

    return breadcrumb;
  },

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      // Mask sensitive data
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration({
      // Track route changes
      // routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
  ],

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Disable in test environment
  enabled:
    process.env.NODE_ENV !== "test" &&
    process.env.NEXT_PUBLIC_SENTRY_DISABLED !== "true",
});

// Helper function to get current user (implement based on your auth system)
function getCurrentUser() {
  // This should integrate with your authentication system
  // For example, if using Supabase:
  // const { data: { user } } = await supabase.auth.getUser();
  // return user;

  // For now, return null - you can implement this based on your auth setup
  return null;
}
