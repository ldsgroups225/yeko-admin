import * as Sentry from "@sentry/nextjs";
import { loggers } from "./logger";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ErrorMetadata {
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "ui"
    | "api"
    | "auth"
    | "database"
    | "network"
    | "validation"
    | "business_logic";
  tags?: Record<string, string>;
  context?: ErrorContext;
  fingerprint?: string[];
  extra?: Record<string, unknown>;
}

export class EnhancedError extends Error {
  public readonly metadata: ErrorMetadata;
  public readonly originalError?: Error;
  public readonly eventId?: string;

  constructor(message: string, metadata: ErrorMetadata, originalError?: Error) {
    super(message);
    this.name = "EnhancedError";
    this.metadata = metadata;
    this.originalError = originalError;

    // Capture the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnhancedError);
    }
  }

  // Capture this error to Sentry and return event ID
  capture(): string {
    const eventId = Sentry.captureException(this, {
      level:
        this.metadata.severity === "critical"
          ? "error"
          : this.metadata.severity === "high"
            ? "error"
            : this.metadata.severity === "medium"
              ? "warning"
              : "info",
      tags: {
        errorType: "enhanced",
        category: this.metadata.category,
        ...this.metadata.tags,
      },
      contexts: {
        error: {
          metadata: this.metadata,
          originalError: this.originalError?.message,
        },
      },
      extra: {
        metadata: this.metadata,
        originalError: this.originalError,
        ...this.metadata.extra,
      },
      fingerprint: this.metadata.fingerprint,
    });

    // Log to Better Stack
    this.logToBetterStack();

    return eventId;
  }

  private logToBetterStack(): void {
    const logLevel = this.getLogLevel();

    loggers.app[logLevel](this.originalError || this, {
      category: this.metadata.category,
      severity: this.metadata.severity,
      errorMessage: this.message,
      errorStack: this.stack,
      originalError: this.originalError?.message,
      originalStack: this.originalError?.stack,
      ...this.metadata.context,
      ...this.metadata.extra,
    });
  }

  private getLogLevel(): "error" {
    return "error";
  }
}

// Error factory functions for common error types
export const ErrorFactory = {
  // UI/Component errors
  component: (
    message: string,
    componentName: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "medium",
        category: "ui",
        tags: { component: componentName },
        context: {
          component: componentName,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // API errors
  api: (
    message: string,
    endpoint: string,
    method: string,
    statusCode?: number,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: statusCode && statusCode >= 500 ? "high" : "medium",
        category: "api",
        tags: {
          endpoint,
          method,
          statusCode: statusCode?.toString() || "unknown",
        },
        context: {
          endpoint,
          method,
          statusCode,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // Authentication errors
  auth: (
    message: string,
    authContext: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "high",
        category: "auth",
        tags: { authContext },
        context: {
          authContext,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // Database errors
  database: (
    message: string,
    operation: string,
    table?: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "high",
        category: "database",
        tags: {
          operation,
          table: table || "unknown",
        },
        context: {
          operation,
          table,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // Network errors
  network: (
    message: string,
    url: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "medium",
        category: "network",
        tags: { url },
        context: {
          url,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // Validation errors
  validation: (
    message: string,
    field: string,
    formName?: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "low",
        category: "validation",
        tags: {
          field,
          form: formName || "unknown",
        },
        context: {
          field,
          formName,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },

  // Business logic errors
  business: (
    message: string,
    businessContext: string,
    context?: Partial<ErrorContext>,
    originalError?: Error,
  ): EnhancedError => {
    return new EnhancedError(
      message,
      {
        severity: "medium",
        category: "business_logic",
        tags: { businessContext },
        context: {
          businessContext,
          timestamp: new Date().toISOString(),
          ...context,
        },
      },
      originalError,
    );
  },
};

// Error boundary utilities
export const ErrorBoundaryUtils = {
  // Create error context from React error info
  createErrorContext: (
    error: Error,
    errorInfo: React.ErrorInfo,
    additionalContext?: Partial<ErrorContext>,
  ): ErrorContext => {
    return {
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      ...additionalContext,
    };
  },

  // Determine error severity based on error type and context
  determineSeverity: (
    error: Error,
    context?: Partial<ErrorContext>,
  ): "low" | "medium" | "high" | "critical" => {
    // Critical errors
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      return "critical";
    }

    // High severity errors
    if (
      error.name === "TypeError" &&
      error.message.includes("Cannot read properties")
    ) {
      return "high";
    }
    if (error.name === "ReferenceError") {
      return "high";
    }

    // Medium severity errors
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return "medium";
    }
    if (error.name === "SyntaxError") {
      return "medium";
    }

    // Check context for additional clues
    if (
      context?.component?.includes("Auth") ||
      context?.component?.includes("Login")
    ) {
      return "high";
    }
    if (
      context?.component?.includes("Payment") ||
      context?.component?.includes("Checkout")
    ) {
      return "critical";
    }

    return "medium";
  },

  // Create error fingerprint for grouping similar errors
  createFingerprint: (
    error: Error,
    context?: Partial<ErrorContext>,
  ): string[] => {
    const parts: string[] = [];

    // Add error name
    parts.push(error.name);

    // Add error message (first 100 chars)
    parts.push(error.message.substring(0, 100));

    // Add component if available
    if (context?.component) {
      parts.push(context.component);
    }

    // Add URL path if available
    if (context?.url) {
      try {
        const url = new URL(context.url);
        parts.push(url.pathname);
      } catch {
        // Ignore invalid URLs
      }
    }

    return parts;
  },

  // Log error with structured data
  logError: (
    error: Error,
    errorInfo: React.ErrorInfo,
    context?: Partial<ErrorContext>,
  ): string => {
    const errorContext = ErrorBoundaryUtils.createErrorContext(
      error,
      errorInfo,
      context,
    );
    const severity = ErrorBoundaryUtils.determineSeverity(error, context);
    const fingerprint = ErrorBoundaryUtils.createFingerprint(error, context);

    const enhancedError = new EnhancedError(
      error.message,
      {
        severity,
        category: "ui",
        tags: {
          errorBoundary: "true",
          component: context?.component || "unknown",
        },
        context: errorContext,
        fingerprint,
      },
      error,
    );

    return enhancedError.capture();
  },
};

// React error boundary hook
export const useErrorBoundary = () => {
  const captureError = (
    error: Error,
    errorInfo: React.ErrorInfo,
    context?: Partial<ErrorContext>,
  ): string => {
    return ErrorBoundaryUtils.logError(error, errorInfo, context);
  };

  const captureComponentError = (
    error: Error,
    componentName: string,
    additionalContext?: Partial<ErrorContext>,
  ): string => {
    const enhancedError = ErrorFactory.component(
      error.message,
      componentName,
      additionalContext,
      error,
    );
    return enhancedError.capture();
  };

  const captureApiError = (
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    additionalContext?: Partial<ErrorContext>,
  ): string => {
    const enhancedError = ErrorFactory.api(
      error.message,
      endpoint,
      method,
      statusCode,
      additionalContext,
      error,
    );
    return enhancedError.capture();
  };

  return {
    captureError,
    captureComponentError,
    captureApiError,
  };
};

// Global error handler for unhandled errors
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      const enhancedError = new EnhancedError(
        `Unhandled promise rejection: ${error.message}`,
        {
          severity: "high",
          category: "ui",
          tags: { type: "unhandled_promise_rejection" },
          context: {
            timestamp: new Date().toISOString(),
            url: window.location.href,
          },
        },
        error,
      );

      enhancedError.capture();
    });

    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      const error =
        event.error instanceof Error ? event.error : new Error(event.message);

      const enhancedError = new EnhancedError(
        `Uncaught error: ${error.message}`,
        {
          severity: "high",
          category: "ui",
          tags: { type: "uncaught_error" },
          context: {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        error,
      );

      enhancedError.capture();
    });
  }
};
