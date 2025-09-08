import { configure, getLogger, type LogRecord } from "@logtape/logtape";

// Better Stack HTTP Transport
class BetterStackTransport {
  private readonly url: string;
  private readonly token: string;
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private batch: LogRecord[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(options: {
    token: string;
    batchSize?: number;
    flushInterval?: number;
  }) {
    this.url = "https://in.logs.betterstack.com/api/v1/logs";
    this.token = options.token;
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 5000;
  }

  log(record: LogRecord) {
    // Only send logs in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      !process.env.BETTER_STACK_ENABLED
    ) {
      return;
    }

    const logEntry = {
      timestamp: record.timestamp,
      level: record.level,
      message: record.message,
      rawMessage: record.rawMessage,
      category: record.category,
      properties: record.properties,
      // Add application context
      app: "yeko-admin",
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "0.1.0",
    };

    this.batch.push(logEntry);

    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  private async flush() {
    if (this.batch.length === 0) return;

    const logs = [...this.batch];
    this.batch = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        console.error(
          "Failed to send logs to Better Stack:",
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error sending logs to Better Stack:", error);
      // Re-add logs to batch for retry (simple retry mechanism)
      this.batch.unshift(...logs);
    }
  }
}

// Console transport with enhanced formatting
class EnhancedConsoleTransport {
  log(record: LogRecord) {
    const timestamp = new Date(record.timestamp).toISOString();
    const level = record.level.toUpperCase().padEnd(5);
    const category = record.category ? `[${record.category}]` : "";
    const message = record.message;
    const properties =
      record.properties && Object.keys(record.properties).length > 0
        ? JSON.stringify(record.properties, null, 2)
        : "";

    const logLine = `${timestamp} ${level} ${category} ${message}`;

    // Color coding for different log levels
    switch (record.level) {
      case "error":
        console.error(
          `\x1b[31m${logLine}\x1b[0m`,
          properties ? `\n${properties}` : "",
        );
        break;
      case "warning":
        console.warn(
          `\x1b[33m${logLine}\x1b[0m`,
          properties ? `\n${properties}` : "",
        );
        break;
      case "info":
        console.info(
          `\x1b[36m${logLine}\x1b[0m`,
          properties ? `\n${properties}` : "",
        );
        break;
      case "debug":
        console.debug(
          `\x1b[90m${logLine}\x1b[0m`,
          properties ? `\n${properties}` : "",
        );
        break;
      default:
        console.log(logLine, properties ? `\n${properties}` : "");
    }
  }
}

// Configure LogTape
export async function configureLogger() {
  const transports: (BetterStackTransport | EnhancedConsoleTransport)[] = [
    // Always include console transport
    new EnhancedConsoleTransport(),
  ];

  // Add Better Stack transport if token is available
  if (process.env.BETTER_STACK_TOKEN) {
    transports.push(
      new BetterStackTransport({
        token: process.env.BETTER_STACK_TOKEN,
        batchSize: parseInt(process.env.BETTER_STACK_BATCH_SIZE || "10", 10),
        flushInterval: parseInt(
          process.env.BETTER_STACK_FLUSH_INTERVAL || "5000",
          10,
        ),
      }),
    );
  }

  await configure({
    sinks: {
      console: (record: LogRecord) => transports[0].log(record), // Use the first transport (EnhancedConsoleTransport)
    },
    filters: {},
    loggers: [
      {
        category: ["app", "auth", "api", "database", "ui"],
        sinks: ["console"],
      },
      // Error logs always go to all transports
      {
        category: "error",
        sinks: ["console"],
      },
    ],
  });
}

// Create logger instances for different parts of the application
export const logger = getLogger("app");
export const authLogger = getLogger("auth");
export const apiLogger = getLogger("api");
export const dbLogger = getLogger("database");
export const uiLogger = getLogger("ui");
export const errorLogger = getLogger("error");

// Utility functions for structured logging
export const loggers = {
  // Application events
  app: {
    startup: (properties?: Record<string, unknown>) =>
      logger.info("Application started", properties),
    shutdown: (properties?: Record<string, unknown>) =>
      logger.info("Application shutdown", properties),
    error: (error: Error, properties?: Record<string, unknown>) =>
      errorLogger.error("Application error", {
        error: error.message,
        stack: error.stack,
        ...properties,
      }),
  },

  // Authentication events
  auth: {
    login: (userId: string, properties?: Record<string, unknown>) =>
      authLogger.info("User login", { userId, ...properties }),
    logout: (userId: string, properties?: Record<string, unknown>) =>
      authLogger.info("User logout", { userId, ...properties }),
    loginFailed: (
      email: string,
      reason: string,
      properties?: Record<string, unknown>,
    ) => authLogger.warn("Login failed", { email, reason, ...properties }),
    sessionExpired: (userId: string, properties?: Record<string, unknown>) =>
      authLogger.info("Session expired", { userId, ...properties }),
  },

  // API events
  api: {
    request: (
      method: string,
      path: string,
      properties?: Record<string, unknown>,
    ) => apiLogger.info("API request", { method, path, ...properties }),
    response: (
      method: string,
      path: string,
      status: number,
      duration: number,
      properties?: Record<string, unknown>,
    ) =>
      apiLogger.info("API response", {
        method,
        path,
        status,
        duration,
        ...properties,
      }),
    error: (
      method: string,
      path: string,
      error: Error,
      properties?: Record<string, unknown>,
    ) =>
      apiLogger.error("API error", {
        method,
        path,
        error: error.message,
        stack: error.stack,
        ...properties,
      }),
  },

  // Database events
  db: {
    query: (
      query: string,
      duration: number,
      properties?: Record<string, unknown>,
    ) => dbLogger.debug("Database query", { query, duration, ...properties }),
    error: (
      query: string,
      error: Error,
      properties?: Record<string, unknown>,
    ) =>
      dbLogger.error("Database error", {
        query,
        error: error.message,
        stack: error.stack,
        ...properties,
      }),
    connection: (
      event: "connected" | "disconnected",
      properties?: Record<string, unknown>,
    ) => dbLogger.info(`Database ${event}`, properties),
  },

  // UI events
  ui: {
    interaction: (
      component: string,
      action: string,
      properties?: Record<string, unknown>,
    ) => uiLogger.debug("UI interaction", { component, action, ...properties }),
    error: (
      component: string,
      error: Error,
      properties?: Record<string, unknown>,
    ) =>
      uiLogger.error("UI error", {
        component,
        error: error.message,
        stack: error.stack,
        ...properties,
      }),
    performance: (
      component: string,
      metric: string,
      value: number,
      properties?: Record<string, unknown>,
    ) =>
      uiLogger.info("UI performance", {
        component,
        metric,
        value,
        ...properties,
      }),
  },
};
