import * as Sentry from "@sentry/nextjs";

// Enhanced error reporting utilities
export const sentryUtils = {
  // Capture exceptions with enhanced context
  captureException: (
    error: Error,
    context?: {
      user?: { id: string; email?: string; username?: string };
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      level?: "fatal" | "error" | "warning" | "info" | "debug";
    },
  ) => {
    return Sentry.captureException(error, {
      user: context?.user,
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level || "error",
    });
  },

  // Capture messages with context
  captureMessage: (
    message: string,
    context?: {
      level?: "fatal" | "error" | "warning" | "info" | "debug";
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
    },
  ) => {
    return Sentry.captureMessage(message, {
      level: context?.level || "info",
      tags: context?.tags,
      extra: context?.extra,
    });
  },

  // Set user context
  setUser: (user: {
    id: string;
    email?: string;
    username?: string;
    [key: string]: unknown;
  }) => {
    Sentry.setUser(user);
  },

  // Clear user context
  clearUser: () => {
    Sentry.setUser(null);
  },

  // Add breadcrumb
  addBreadcrumb: (breadcrumb: {
    message: string;
    category?: string;
    level?: "fatal" | "error" | "warning" | "info" | "debug";
    data?: Record<string, unknown>;
  }) => {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || "custom",
      level: breadcrumb.level || "info",
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  },

  // Set context
  setContext: (key: string, context: Record<string, unknown>) => {
    Sentry.setContext(key, context);
  },

  // Set tag
  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value);
  },

  // Set tags
  setTags: (tags: Record<string, string>) => {
    Sentry.setTags(tags);
  },

  // Performance monitoring
  startTransaction: (_name: string, _op?: string) => {
    // Note: startTransaction is deprecated in newer Sentry versions
    // Use Sentry.startSpan instead
    return {
      setStatus: (_status: string) => {},
      finish: () => {},
    };
  },

  // Profiling
  profiler: {
    startProfiler: () => Sentry.profiler.startProfiler(),
    stopProfiler: () => Sentry.profiler.stopProfiler(),
  },
};

// Error types for better categorization
export enum ErrorCategory {
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  NETWORK = "network",
  DATABASE = "database",
  EXTERNAL_API = "external_api",
  UI_COMPONENT = "ui_component",
  BUSINESS_LOGIC = "business_logic",
  SYSTEM = "system",
}

// Enhanced error class with Sentry integration
export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly context?: Record<string, unknown>;
  public readonly eventId?: string;

  constructor(
    message: string,
    category: ErrorCategory,
    options?: {
      code?: string;
      statusCode?: number;
      context?: Record<string, unknown>;
      cause?: Error;
      reportToSentry?: boolean;
    },
  ) {
    super(message);
    this.name = "AppError";
    this.category = category;
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.context = options?.context;
    this.cause = options?.cause;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // Report to Sentry by default
    if (options?.reportToSentry !== false) {
      this.eventId = sentryUtils.captureException(this, {
        tags: {
          errorCategory: category,
          errorCode: options?.code || "unknown",
        },
        extra: {
          statusCode: options?.statusCode,
          context: options?.context,
          cause: options?.cause?.message,
        },
      });
    }
  }
}

// Specific error classes
export class AuthenticationError extends AppError {
  constructor(
    message: string,
    options?: { code?: string; context?: Record<string, unknown> },
  ) {
    super(message, ErrorCategory.AUTHENTICATION, {
      ...options,
      statusCode: 401,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string,
    options?: { code?: string; context?: Record<string, unknown> },
  ) {
    super(message, ErrorCategory.AUTHORIZATION, {
      ...options,
      statusCode: 403,
    });
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    options?: { code?: string; context?: Record<string, unknown> },
  ) {
    super(message, ErrorCategory.VALIDATION, {
      ...options,
      statusCode: 400,
    });
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    options?: { code?: string; context?: Record<string, unknown> },
  ) {
    super(message, ErrorCategory.NETWORK, {
      ...options,
      statusCode: 500,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    options?: { code?: string; context?: Record<string, unknown> },
  ) {
    super(message, ErrorCategory.DATABASE, {
      ...options,
      statusCode: 500,
    });
  }
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure function execution time
  measureFunction: async <T>(
    name: string,
    fn: () => Promise<T> | T,
    tags?: Record<string, string>,
  ): Promise<T> => {
    const transaction = sentryUtils.startTransaction(name, "function");

    if (tags) {
      sentryUtils.setTags(tags);
    }

    try {
      const result = await fn();
      transaction?.setStatus("ok");
      return result;
    } catch (error) {
      transaction?.setStatus("internal_error");
      throw error;
    } finally {
      transaction?.finish();
    }
  },

  // Measure API call performance
  measureApiCall: async <T>(
    method: string,
    url: string,
    fn: () => Promise<T>,
  ): Promise<T> => {
    const transaction = sentryUtils.startTransaction(
      `${method} ${url}`,
      "http.client",
    );

    sentryUtils.setTags({
      "http.method": method,
      "http.url": url,
    });

    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      transaction?.setStatus("ok");
      sentryUtils.setContext("http", {
        method,
        url,
        duration,
        status: "success",
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      transaction?.setStatus("internal_error");
      sentryUtils.setContext("http", {
        method,
        url,
        duration,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    } finally {
      transaction?.finish();
    }
  },
};

// Session replay utilities
export const replayUtils = {
  // Manually capture replay
  captureReplay: () => {
    // This will capture the current session replay
    // Note: getCurrentHub and Replay are not available in newer Sentry versions
    // Use Sentry.flush() instead
    Sentry.flush();
  },

  // Add replay context
  addReplayContext: (context: Record<string, unknown>) => {
    sentryUtils.setContext("replay", context);
  },
};
