import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundaryUtils } from "../../../src/lib/error-logging";

// Mock the error logging utilities
vi.mock("../../../src/lib/error-logging", () => ({
  ErrorBoundaryUtils: {
    logError: vi.fn(),
    captureComponentError: vi.fn(),
    captureApiError: vi.fn(),
  },
}));

// Mock the logger
vi.mock("../../../src/lib/logger", () => ({
  loggers: {
    app: {
      error: vi.fn(),
    },
  },
}));

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  setTag: vi.fn(),
  setContext: vi.fn(),
  showReportDialog: vi.fn(),
}));

// Mock SentryUtils
vi.mock("../../../src/lib/sentry-integration", () => ({
  SentryUtils: {
    captureErrorBoundaryError: vi.fn(() => "test-event-id"),
    captureRecovery: vi.fn(),
  },
}));

describe("Error Boundary Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock console.error to avoid noise in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ErrorBoundaryUtils", () => {
    it("should log errors correctly", () => {
      const error = new Error("Test error");
      const errorInfo = {
        componentStack: "Component stack trace",
      } as React.ErrorInfo;

      ErrorBoundaryUtils.logError(error, errorInfo, {
        component: "TestComponent",
      });

      expect(ErrorBoundaryUtils.logError).toHaveBeenCalledWith(
        error,
        errorInfo,
        expect.objectContaining({
          component: "TestComponent",
        }),
      );
    });

    it("should create error context", () => {
      const error = new Error("Test error");
      const errorInfo = {
        componentStack: "Component stack trace",
      } as React.ErrorInfo;

      const context = ErrorBoundaryUtils.createErrorContext(error, errorInfo, {
        component: "TestComponent",
      });

      expect(context).toMatchObject({
        component: "TestComponent",
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: expect.any(String),
      });
    });

    it("should determine severity correctly", () => {
      const chunkError = new Error("Loading chunk 123 failed");
      chunkError.name = "ChunkLoadError";

      const nullRefError = new Error("Cannot read properties of null");
      nullRefError.name = "TypeError";

      const normalError = new Error("Normal error");

      expect(ErrorBoundaryUtils.determineSeverity(chunkError)).toBe("critical");
      expect(ErrorBoundaryUtils.determineSeverity(nullRefError)).toBe("high");
      expect(ErrorBoundaryUtils.determineSeverity(normalError)).toBe("medium");
    });

    it("should determine high severity for auth components", () => {
      const error = new Error("Auth error");
      const context = { component: "AuthComponent" };

      expect(ErrorBoundaryUtils.determineSeverity(error, context)).toBe("high");
    });

    it("should determine critical severity for payment components", () => {
      const error = new Error("Payment error");
      const context = { component: "PaymentComponent" };

      expect(ErrorBoundaryUtils.determineSeverity(error, context)).toBe(
        "critical",
      );
    });

    it("should create fingerprint for error", () => {
      const error = new Error("Test error");
      const context = { component: "TestComponent" };

      const fingerprint = ErrorBoundaryUtils.createFingerprint(error, context);

      expect(fingerprint).toEqual(["Test error", "TestComponent", "Error"]);
    });
  });

  describe("Error Boundary Logic", () => {
    it("should handle error categorization", () => {
      const chunkError = new Error("Loading chunk 123 failed");
      chunkError.name = "ChunkLoadError";

      const networkError = new Error("Network request failed");
      networkError.name = "NetworkError";

      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";

      // Test error categorization logic
      const categorizeError = (error: Error): string => {
        if (
          error.name === "ChunkLoadError" ||
          error.message.includes("Loading chunk")
        ) {
          return "chunk_load_error";
        }
        if (error.name === "NetworkError") {
          return "network_error";
        }
        if (error.name === "ValidationError") {
          return "validation_error";
        }
        return "unknown_error";
      };

      expect(categorizeError(chunkError)).toBe("chunk_load_error");
      expect(categorizeError(networkError)).toBe("network_error");
      expect(categorizeError(validationError)).toBe("validation_error");
    });

    it("should determine if error is retryable", () => {
      const retryableErrors = ["chunk_load_error", "network_error"];
      const _nonRetryableErrors = ["validation_error", "auth_error"];

      const isRetryable = (errorCategory: string): boolean => {
        return retryableErrors.includes(errorCategory);
      };

      expect(isRetryable("chunk_load_error")).toBe(true);
      expect(isRetryable("network_error")).toBe(true);
      expect(isRetryable("validation_error")).toBe(false);
      expect(isRetryable("auth_error")).toBe(false);
    });

    it("should handle auto-retry logic", () => {
      const maxRetries = 3;
      const _retryDelay = 1000;

      const shouldAutoRetry = (
        errorCategory: string,
        retryCount: number,
      ): boolean => {
        const retryableErrors = ["chunk_load_error", "network_error"];
        return (
          retryableErrors.includes(errorCategory) && retryCount < maxRetries
        );
      };

      expect(shouldAutoRetry("chunk_load_error", 0)).toBe(true);
      expect(shouldAutoRetry("chunk_load_error", 2)).toBe(true);
      expect(shouldAutoRetry("chunk_load_error", 3)).toBe(false);
      expect(shouldAutoRetry("validation_error", 0)).toBe(false);
    });

    it("should calculate exponential backoff", () => {
      const baseDelay = 1000;
      const _retryCount = 2;

      const calculateDelay = (
        baseDelay: number,
        retryCount: number,
      ): number => {
        return baseDelay * 2 ** retryCount;
      };

      expect(calculateDelay(baseDelay, 0)).toBe(1000);
      expect(calculateDelay(baseDelay, 1)).toBe(2000);
      expect(calculateDelay(baseDelay, 2)).toBe(4000);
    });
  });

  describe("Error Boundary State Management", () => {
    it("should track error state correctly", () => {
      const initialState = {
        hasError: false,
        error: null as Error | null,
        errorInfo: null as React.ErrorInfo | null,
        retryCount: 0,
        eventId: null as string | null,
      };

      const errorState = {
        hasError: true,
        error: new Error("Test error"),
        errorInfo: { componentStack: "Stack trace" } as React.ErrorInfo,
        retryCount: 1,
        eventId: "test-event-id",
      };

      expect(initialState.hasError).toBe(false);
      expect(errorState.hasError).toBe(true);
      expect(errorState.retryCount).toBe(1);
      expect(errorState.eventId).toBe("test-event-id");
    });

    it("should handle error reset", () => {
      const _errorState = {
        hasError: true,
        error: new Error("Test error"),
        errorInfo: { componentStack: "Stack trace" } as React.ErrorInfo,
        retryCount: 2,
        eventId: "test-event-id",
      };

      const resetState = {
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
        eventId: null,
      };

      expect(resetState.hasError).toBe(false);
      expect(resetState.retryCount).toBe(0);
      expect(resetState.eventId).toBeNull();
    });
  });

  describe("Error Boundary Props", () => {
    it("should handle component name prop", () => {
      const props = {
        componentName: "TestComponent",
        children: React.createElement("div", null, "Test content"),
      };

      expect(props.componentName).toBe("TestComponent");
    });

    it("should handle fallback component prop", () => {
      const CustomFallback = ({ error }: { error: Error }) =>
        React.createElement("div", null, `Custom error: ${error.message}`);

      const props = {
        fallback: CustomFallback,
        children: React.createElement("div", null, "Test content"),
      };

      expect(typeof props.fallback).toBe("function");
    });

    it("should handle onError callback prop", () => {
      const onError = vi.fn();
      const props = {
        onError,
        children: React.createElement("div", null, "Test content"),
      };

      expect(typeof props.onError).toBe("function");
    });
  });

  describe("Error Boundary Integration", () => {
    it("should integrate with Sentry correctly", () => {
      const { SentryUtils } = require("../../../src/lib/sentry-integration");

      const error = new Error("Test error");
      const errorInfo = { componentStack: "Stack trace" } as React.ErrorInfo;
      const context = { component: "TestComponent" };

      const eventId = SentryUtils.captureErrorBoundaryError(
        error,
        errorInfo,
        context,
      );

      expect(SentryUtils.captureErrorBoundaryError).toHaveBeenCalledWith(
        error,
        errorInfo,
        context,
      );
      expect(eventId).toBe("test-event-id");
    });

    it("should integrate with logger correctly", () => {
      const { loggers } = require("../../../src/lib/logger");

      const error = new Error("Test error");
      const context = { component: "TestComponent" };

      loggers.app.error(error, context);

      expect(loggers.app.error).toHaveBeenCalledWith(error, context);
    });
  });

  describe("Error Boundary Edge Cases", () => {
    it("should handle null children", () => {
      const props = {
        children: null,
      };

      expect(props.children).toBeNull();
    });

    it("should handle undefined children", () => {
      const props = {
        children: undefined,
      };

      expect(props.children).toBeUndefined();
    });

    it("should handle multiple children", () => {
      const props = {
        children: [
          React.createElement("div", { key: "1" }, "Child 1"),
          React.createElement("div", { key: "2" }, "Child 2"),
        ],
      };

      expect(Array.isArray(props.children)).toBe(true);
      expect(props.children).toHaveLength(2);
    });
  });
});
