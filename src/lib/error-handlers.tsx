import React from "react";
import { setupGlobalErrorHandlers } from "./error-logging";
import { loggers } from "./logger";

// Initialize global error handlers
export const initializeErrorHandlers = () => {
  // Set up global error handlers for unhandled errors
  setupGlobalErrorHandlers();

  // Set up additional error handlers specific to the app
  if (typeof window !== "undefined") {
    // Handle resource loading errors
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          const target = event.target as HTMLElement;
          const error = new Error(`Resource loading error: ${target.tagName}`);

          loggers.app.error(error, {
            category: "resource_loading",
            resourceType: target.tagName,
            resourceSrc:
              (target as HTMLImageElement).src ||
              (target as HTMLAnchorElement).href,
            timestamp: new Date().toISOString(),
          });
        }
      },
      true,
    );

    // Handle network status changes
    window.addEventListener("online", () => {
      loggers.app.error(new Error("Network connection restored"), {
        category: "network",
        status: "online",
        timestamp: new Date().toISOString(),
      });
    });

    window.addEventListener("offline", () => {
      loggers.app.error(new Error("Network connection lost"), {
        category: "network",
        status: "offline",
        timestamp: new Date().toISOString(),
      });
    });

    // Handle visibility changes (tab switching)
    document.addEventListener("visibilitychange", () => {
      const isVisible = !document.hidden;
      loggers.app.error(
        new Error(
          `Page visibility changed: ${isVisible ? "visible" : "hidden"}`,
        ),
        {
          category: "page_lifecycle",
          visibility: isVisible ? "visible" : "hidden",
          timestamp: new Date().toISOString(),
        },
      );
    });

    // Handle page unload
    window.addEventListener("beforeunload", () => {
      loggers.app.error(new Error("Page unloading"), {
        category: "page_lifecycle",
        action: "beforeunload",
        timestamp: new Date().toISOString(),
      });
    });
  }
};

// Error boundary context provider
export const ErrorBoundaryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    initializeErrorHandlers();
  }, []);

  return <>{children}</>;
};

// Hook for error boundary context
export const useErrorBoundaryContext = () => {
  const [errorCount, setErrorCount] = React.useState(0);
  const [lastError, setLastError] = React.useState<Error | null>(null);

  const incrementErrorCount = React.useCallback(() => {
    setErrorCount((prev) => prev + 1);
  }, []);

  const setError = React.useCallback(
    (error: Error) => {
      setLastError(error);
      incrementErrorCount();
    },
    [incrementErrorCount],
  );

  const clearError = React.useCallback(() => {
    setLastError(null);
  }, []);

  return {
    errorCount,
    lastError,
    setError,
    clearError,
    incrementErrorCount,
  };
};
