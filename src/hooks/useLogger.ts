import { useCallback } from "react";

// Client-side logging interface that mirrors server-side loggers
interface ClientLogger {
  debug: (message: string, properties?: Record<string, unknown>) => void;
  info: (message: string, properties?: Record<string, unknown>) => void;
  warn: (message: string, properties?: Record<string, unknown>) => void;
  error: (message: string, properties?: Record<string, unknown>) => void;
}

// Client-side logging implementation
function createClientLogger(category: string): ClientLogger {
  const log = (
    level: "debug" | "info" | "warn" | "error",
    message: string,
    properties?: Record<string, unknown>,
  ) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      properties,
      // Client-side context
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    // Console logging with formatting
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()} [${category}] ${message}`;

    switch (level) {
      case "debug":
        console.debug(formattedMessage, properties || "");
        break;
      case "info":
        console.info(formattedMessage, properties || "");
        break;
      case "warn":
        console.warn(formattedMessage, properties || "");
        break;
      case "error":
        console.error(formattedMessage, properties || "");
        break;
    }

    // Send to server-side logging endpoint in production
    if (process.env.NODE_ENV === "production" && level !== "debug") {
      fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logEntry),
      }).catch((err) => {
        console.error("Failed to send log to server:", err);
      });
    }
  };

  return {
    debug: (message: string, properties?: Record<string, unknown>) =>
      log("debug", message, properties),
    info: (message: string, properties?: Record<string, unknown>) =>
      log("info", message, properties),
    warn: (message: string, properties?: Record<string, unknown>) =>
      log("warn", message, properties),
    error: (message: string, properties?: Record<string, unknown>) =>
      log("error", message, properties),
  };
}

// Hook for UI component logging
export function useLogger(component: string) {
  const logger = createClientLogger(`ui.${component}`);

  const logInteraction = useCallback(
    (action: string, properties?: Record<string, unknown>) => {
      logger.info(`User interaction: ${action}`, properties);
    },
    [logger],
  );

  const logError = useCallback(
    (error: Error, properties?: Record<string, unknown>) => {
      logger.error(`Component error: ${error.message}`, {
        stack: error.stack,
        ...properties,
      });
    },
    [logger],
  );

  const logPerformance = useCallback(
    (metric: string, value: number, properties?: Record<string, unknown>) => {
      logger.info(`Performance metric: ${metric}`, {
        value,
        unit: "ms",
        ...properties,
      });
    },
    [logger],
  );

  return {
    logger,
    logInteraction,
    logError,
    logPerformance,
  };
}

// Hook for API logging
export function useApiLogger() {
  const logger = createClientLogger("api.client");

  const logRequest = useCallback(
    (method: string, url: string, properties?: Record<string, unknown>) => {
      logger.info(`API request: ${method} ${url}`, properties);
    },
    [logger],
  );

  const logResponse = useCallback(
    (
      method: string,
      url: string,
      status: number,
      duration: number,
      properties?: Record<string, unknown>,
    ) => {
      const level = status >= 400 ? "error" : status >= 300 ? "warn" : "info";
      logger[level](`API response: ${method} ${url} ${status}`, {
        duration,
        ...properties,
      });
    },
    [logger],
  );

  const logError = useCallback(
    (
      method: string,
      url: string,
      error: Error,
      properties?: Record<string, unknown>,
    ) => {
      logger.error(`API error: ${method} ${url}`, {
        error: error.message,
        stack: error.stack,
        ...properties,
      });
    },
    [logger],
  );

  return {
    logger,
    logRequest,
    logResponse,
    logError,
  };
}

// Hook for authentication logging
export function useAuthLogger() {
  const logger = createClientLogger("auth.client");

  const logLogin = useCallback(
    (method: string, properties?: Record<string, unknown>) => {
      logger.info(`Login attempt: ${method}`, properties);
    },
    [logger],
  );

  const logLoginSuccess = useCallback(
    (userId: string, method: string, properties?: Record<string, unknown>) => {
      logger.info(`Login successful: ${method}`, { userId, ...properties });
    },
    [logger],
  );

  const logLoginFailure = useCallback(
    (method: string, reason: string, properties?: Record<string, unknown>) => {
      logger.warn(`Login failed: ${method}`, { reason, ...properties });
    },
    [logger],
  );

  const logLogout = useCallback(
    (userId: string, properties?: Record<string, unknown>) => {
      logger.info("User logout", { userId, ...properties });
    },
    [logger],
  );

  return {
    logger,
    logLogin,
    logLoginSuccess,
    logLoginFailure,
    logLogout,
  };
}
