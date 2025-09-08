import * as Sentry from "@sentry/nextjs";
import { loggers } from "./logger";

// Enhanced Sentry integration for error boundaries
export class SentryErrorBoundaryIntegration {
  private static instance: SentryErrorBoundaryIntegration;
  private errorCount = 0;
  private lastErrorTime: Date | null = null;

  private constructor() {
    this.setupSentryIntegrations();
  }

  public static getInstance(): SentryErrorBoundaryIntegration {
    if (!SentryErrorBoundaryIntegration.instance) {
      SentryErrorBoundaryIntegration.instance =
        new SentryErrorBoundaryIntegration();
    }
    return SentryErrorBoundaryIntegration.instance;
  }

  private setupSentryIntegrations(): void {
    // Set up Sentry integrations for error boundaries
    Sentry.addBreadcrumb({
      message: "Error boundary system initialized",
      category: "error_boundary",
      level: "info",
      data: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    });

    // Set up performance monitoring for error boundaries
    Sentry.addIntegration({
      name: "ErrorBoundaryIntegration",
      setupOnce: () => {
        // Custom integration setup
      },
    });
  }

  // Capture error with enhanced context
  public captureErrorBoundaryError(
    error: Error,
    errorInfo: React.ErrorInfo,
    context: {
      componentName?: string;
      errorBoundaryType?: string;
      retryCount?: number;
      additionalContext?: Record<string, unknown>;
    },
  ): string {
    this.errorCount++;
    this.lastErrorTime = new Date();

    // Add error boundary specific context
    Sentry.setContext("error_boundary", {
      componentName: context.componentName,
      errorBoundaryType: context.errorBoundaryType,
      retryCount: context.retryCount || 0,
      totalErrors: this.errorCount,
      lastErrorTime: this.lastErrorTime.toISOString(),
      ...context.additionalContext,
    });

    // Add performance context
    Sentry.setContext("performance", {
      errorBoundaryErrors: this.errorCount,
      timeSinceLastError: this.lastErrorTime
        ? Date.now() - this.lastErrorTime.getTime()
        : null,
    });

    // Add user context if available
    const user = Sentry.getCurrentScope().getUser();
    if (user) {
      Sentry.setContext("user_session", {
        userId: user.id,
        email: user.email,
        username: user.username,
        errorCount: this.errorCount,
      });
    }

    // Capture the error
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        error_boundary: {
          componentName: context.componentName,
          errorBoundaryType: context.errorBoundaryType,
          retryCount: context.retryCount || 0,
          totalErrors: this.errorCount,
          lastErrorTime: this.lastErrorTime.toISOString(),
        },
        ...context.additionalContext,
      },
      tags: {
        errorBoundary: true,
        component: context.componentName || "unknown",
        errorBoundaryType: context.errorBoundaryType || "generic",
        retryCount: (context.retryCount || 0).toString(),
        errorCount: this.errorCount.toString(),
      },
      extra: {
        errorInfo,
        errorBoundaryContext: context,
        performance: {
          errorCount: this.errorCount,
          timeSinceLastError: this.lastErrorTime
            ? Date.now() - this.lastErrorTime.getTime()
            : null,
        },
      },
      level: this.determineErrorLevel(error, context),
      fingerprint: this.createFingerprint(error, context),
    });

    // Log to Better Stack
    loggers.app.error(error, {
      category: "error_boundary",
      componentName: context.componentName,
      errorBoundaryType: context.errorBoundaryType,
      retryCount: context.retryCount || 0,
      totalErrors: this.errorCount,
      eventId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      ...context.additionalContext,
    });

    return eventId;
  }

  // Capture recovery event
  public captureRecovery(
    componentName: string,
    retryCount: number,
    recoveryTime: number,
  ): void {
    Sentry.addBreadcrumb({
      message: "Error boundary recovered",
      category: "error_boundary",
      level: "info",
      data: {
        componentName,
        retryCount,
        recoveryTime,
        timestamp: new Date().toISOString(),
      },
    });

    Sentry.captureMessage("Error boundary recovery", {
      level: "info",
      tags: {
        errorBoundary: true,
        component: componentName,
        recovery: true,
      },
      extra: {
        componentName,
        retryCount,
        recoveryTime,
        totalErrors: this.errorCount,
      },
    });

    // Log to Better Stack
    loggers.app.error(new Error("Error boundary recovered"), {
      category: "error_boundary",
      componentName,
      retryCount,
      recoveryTime,
      totalErrors: this.errorCount,
      timestamp: new Date().toISOString(),
    });
  }

  // Set user context for error boundaries
  public setUserContext(user: {
    id: string;
    email?: string;
    username?: string;
    [key: string]: unknown;
  }): void {
    Sentry.setUser(user);
    Sentry.setContext("user_error_boundary", {
      userId: user.id,
      email: user.email,
      username: user.username,
      errorCount: this.errorCount,
      lastErrorTime: this.lastErrorTime?.toISOString(),
    });
  }

  // Clear user context
  public clearUserContext(): void {
    Sentry.setUser(null);
    Sentry.setContext("user_error_boundary", null);
  }

  // Get error statistics
  public getErrorStats(): {
    totalErrors: number;
    lastErrorTime: Date | null;
    timeSinceLastError: number | null;
  } {
    return {
      totalErrors: this.errorCount,
      lastErrorTime: this.lastErrorTime,
      timeSinceLastError: this.lastErrorTime
        ? Date.now() - this.lastErrorTime.getTime()
        : null,
    };
  }

  // Reset error statistics
  public resetErrorStats(): void {
    this.errorCount = 0;
    this.lastErrorTime = null;

    Sentry.addBreadcrumb({
      message: "Error boundary statistics reset",
      category: "error_boundary",
      level: "info",
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  private determineErrorLevel(
    error: Error,
    context: { retryCount?: number; componentName?: string },
  ): "error" | "warning" | "info" {
    // Critical errors
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      return "error";
    }

    // High severity errors
    if (
      error.name === "TypeError" &&
      error.message.includes("Cannot read properties")
    ) {
      return "error";
    }
    if (error.name === "ReferenceError") {
      return "error";
    }

    // Check retry count
    if (context.retryCount && context.retryCount > 2) {
      return "error";
    }

    // Check component importance
    if (
      context.componentName?.includes("Auth") ||
      context.componentName?.includes("Login")
    ) {
      return "error";
    }
    if (
      context.componentName?.includes("Payment") ||
      context.componentName?.includes("Checkout")
    ) {
      return "error";
    }

    // Network errors might be temporary
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return "warning";
    }

    return "error";
  }

  private createFingerprint(
    error: Error,
    context: { componentName?: string; errorBoundaryType?: string },
  ): string[] {
    const parts: string[] = [];

    // Add error name
    parts.push(error.name);

    // Add error message (first 100 chars)
    parts.push(error.message.substring(0, 100));

    // Add component name if available
    if (context.componentName) {
      parts.push(context.componentName);
    }

    // Add error boundary type
    if (context.errorBoundaryType) {
      parts.push(context.errorBoundaryType);
    }

    return parts;
  }
}

// Export singleton instance
export const sentryErrorBoundaryIntegration =
  SentryErrorBoundaryIntegration.getInstance();

// Utility functions for Sentry integration
export const SentryUtils = {
  // Capture error boundary error
  captureErrorBoundaryError: (
    error: Error,
    errorInfo: React.ErrorInfo,
    context: {
      componentName?: string;
      errorBoundaryType?: string;
      retryCount?: number;
      additionalContext?: Record<string, unknown>;
    },
  ): string => {
    return sentryErrorBoundaryIntegration.captureErrorBoundaryError(
      error,
      errorInfo,
      context,
    );
  },

  // Capture recovery
  captureRecovery: (
    componentName: string,
    retryCount: number,
    recoveryTime: number,
  ): void => {
    sentryErrorBoundaryIntegration.captureRecovery(
      componentName,
      retryCount,
      recoveryTime,
    );
  },

  // Set user context
  setUserContext: (user: {
    id: string;
    email?: string;
    username?: string;
    [key: string]: unknown;
  }): void => {
    sentryErrorBoundaryIntegration.setUserContext(user);
  },

  // Clear user context
  clearUserContext: (): void => {
    sentryErrorBoundaryIntegration.clearUserContext();
  },

  // Get error statistics
  getErrorStats: () => {
    return sentryErrorBoundaryIntegration.getErrorStats();
  },

  // Reset error statistics
  resetErrorStats: (): void => {
    sentryErrorBoundaryIntegration.resetErrorStats();
  },
};

// React hook for Sentry error boundary integration
export const useSentryErrorBoundary = () => {
  const captureError = (
    error: Error,
    errorInfo: React.ErrorInfo,
    context: {
      componentName?: string;
      errorBoundaryType?: string;
      retryCount?: number;
      additionalContext?: Record<string, unknown>;
    },
  ): string => {
    return SentryUtils.captureErrorBoundaryError(error, errorInfo, context);
  };

  const captureRecovery = (
    componentName: string,
    retryCount: number,
    recoveryTime: number,
  ): void => {
    SentryUtils.captureRecovery(componentName, retryCount, recoveryTime);
  };

  const setUserContext = (user: {
    id: string;
    email?: string;
    username?: string;
    [key: string]: unknown;
  }): void => {
    SentryUtils.setUserContext(user);
  };

  const clearUserContext = (): void => {
    SentryUtils.clearUserContext();
  };

  const getErrorStats = () => {
    return SentryUtils.getErrorStats();
  };

  const resetErrorStats = (): void => {
    SentryUtils.resetErrorStats();
  };

  return {
    captureError,
    captureRecovery,
    setUserContext,
    clearUserContext,
    getErrorStats,
    resetErrorStats,
  };
};
