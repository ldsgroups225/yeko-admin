"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, Bug, Home, RefreshCw, Send } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loggers } from "@/lib/logger";
import { SentryUtils } from "@/lib/sentry-integration";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
  retryCount: number;
  lastErrorTime?: Date;
  errorHistory: Array<{
    error: Error;
    timestamp: Date;
    eventId?: string;
  }>;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDialog?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  componentName?: string;
  context?: Record<string, unknown>;
  logToBetterStack?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  eventId?: string;
  retryCount: number;
  maxRetries: number;
  canRetry: boolean;
  componentName?: string;
  errorHistory: Array<{
    error: Error;
    timestamp: Date;
    eventId?: string;
  }>;
}

class EnhancedErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      errorHistory: [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: new Date(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName, context, logToBetterStack = true } = this.props;
    const { retryCount, errorHistory } = this.state;

    // Enhanced error logging
    this.logError(error, errorInfo, {
      componentName,
      context,
      retryCount,
      logToBetterStack,
    });

    // Send to Sentry with enhanced context using the integration
    const eventId = SentryUtils.captureErrorBoundaryError(error, errorInfo, {
      componentName: componentName || this.constructor.name,
      errorBoundaryType: "enhanced",
      retryCount,
      additionalContext: {
        ...context,
        errorHistory: errorHistory.length,
        lastErrorTime: this.state.lastErrorTime?.toISOString(),
        errorType: this.categorizeError(error),
        props: this.props,
        errorHistoryDetails: errorHistory.map((e) => ({
          message: e.error.message,
          timestamp: e.timestamp.toISOString(),
          eventId: e.eventId,
        })),
      },
    });

    // Update state with new error
    const newErrorHistory = [
      ...errorHistory,
      {
        error,
        timestamp: new Date(),
        eventId,
      },
    ].slice(-5); // Keep only last 5 errors

    this.setState({
      error,
      errorInfo,
      eventId,
      errorHistory: newErrorHistory,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Auto-retry logic for certain error types
    this.handleAutoRetry(error, retryCount);
  }

  private logError = (
    error: Error,
    errorInfo: React.ErrorInfo,
    context: {
      componentName?: string;
      context?: Record<string, unknown>;
      retryCount: number;
      logToBetterStack: boolean;
    },
  ) => {
    const {
      componentName,
      context: additionalContext,
      retryCount,
      logToBetterStack,
    } = context;

    // Console logging for development
    console.group(`🚨 ErrorBoundary Error (${componentName || "Unknown"})`);
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Context:", additionalContext);
    console.error("Retry Count:", retryCount);
    console.groupEnd();

    // Structured logging to Better Stack
    if (logToBetterStack) {
      loggers.app.error(error, {
        component: componentName || "ErrorBoundary",
        errorType: this.categorizeError(error),
        retryCount,
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
        ...additionalContext,
      });
    }
  };

  private categorizeError = (error: Error): string => {
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      return "chunk_load_error";
    }
    if (
      error.name === "TypeError" &&
      error.message.includes("Cannot read properties")
    ) {
      return "null_reference_error";
    }
    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return "network_error";
    }
    if (error.name === "SyntaxError") {
      return "syntax_error";
    }
    return "unknown_error";
  };

  private handleAutoRetry = (error: Error, retryCount: number) => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const category = this.categorizeError(error);

    // Auto-retry for certain error types
    if (
      (category === "chunk_load_error" || category === "network_error") &&
      retryCount < maxRetries
    ) {
      this.retryTimeoutId = setTimeout(
        () => {
          this.resetError();
        },
        retryDelay * 2 ** retryCount,
      ); // Exponential backoff
    }
  };

  resetError = () => {
    const { retryCount } = this.state;

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = undefined;
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      eventId: undefined,
      retryCount: retryCount + 1,
    });

    // Log successful recovery
    const recoveryTime = Date.now();
    SentryUtils.captureRecovery(
      this.props.componentName || "ErrorBoundary",
      retryCount + 1,
      recoveryTime,
    );
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      const { maxRetries = 3 } = this.props;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <FallbackComponent
          error={this.state.error || new Error("Unknown error")}
          resetError={this.resetError}
          eventId={this.state.eventId}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
          canRetry={canRetry}
          componentName={this.props.componentName}
          errorHistory={this.state.errorHistory}
        />
      );
    }

    return this.props.children;
  }
}

// Enhanced default error fallback component
function DefaultErrorFallback({
  error,
  resetError,
  eventId,
  retryCount,
  maxRetries,
  canRetry,
  componentName,
  errorHistory,
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleReportFeedback = async () => {
    if (!eventId) return;

    setIsReporting(true);
    try {
      Sentry.showReportDialog({ eventId });
    } catch (error) {
      console.error("Failed to show report dialog:", error);
    } finally {
      setIsReporting(false);
    }
  };

  const errorCategory = categorizeError(error);
  const isRetryable = ["chunk_load_error", "network_error"].includes(
    errorCategory,
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">
            {componentName ? `${componentName} Error` : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {isRetryable && canRetry
              ? "A temporary error occurred. We're trying to fix it automatically."
              : "An unexpected error occurred. We've been notified and are working to fix it."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error category badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {errorCategory.replace(/_/g, " ").toUpperCase()}
            </Badge>
          </div>

          {/* Retry information */}
          {retryCount > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Retry attempt {retryCount} of {maxRetries}
            </div>
          )}

          {/* Error history */}
          {errorHistory.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Errors</h4>
              <div className="space-y-1">
                {errorHistory.slice(-3).map((err, index) => (
                  <div
                    key={`error-${err.timestamp.getTime()}-${index}`}
                    className="flex items-center justify-between text-xs bg-muted p-2 rounded"
                  >
                    <span className="truncate">{err.error.message}</span>
                    <span className="text-muted-foreground">
                      {err.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development error details */}
          {process.env.NODE_ENV === "development" && (
            <details className="rounded-md bg-gray-50 dark:bg-gray-900 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details (Development) {showDetails ? "▼" : "▶"}
              </summary>
              {showDetails && (
                <div className="mt-2 space-y-2">
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                    {error.message}
                    {"\n\n"}
                    {error.stack}
                  </pre>
                  {componentName && (
                    <div className="text-xs text-gray-500">
                      Component: {componentName}
                    </div>
                  )}
                </div>
              )}
            </details>
          )}

          {/* Error ID */}
          {eventId && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Error ID:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">
                {eventId}
              </code>
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            {canRetry && (
              <Button
                onClick={resetError}
                variant="outline"
                className="flex-1"
                disabled={isRetryable && retryCount > 0} // Disable if auto-retrying
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isRetryable ? "Retry Now" : "Try Again"}
              </Button>
            )}
            <Button
              onClick={() => {
                window.location.href = "/";
              }}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          {eventId && (
            <Button
              onClick={handleReportFeedback}
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={isReporting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isReporting ? "Opening..." : "Report Feedback"}
            </Button>
          )}

          {/* Debug information for development */}
          {process.env.NODE_ENV === "development" && (
            <Button
              onClick={() => {
                console.group("🐛 Error Boundary Debug Info");
                console.log("Error:", error);
                console.log("Retry Count:", retryCount);
                console.log("Error History:", errorHistory);
                console.log("Component Name:", componentName);
                console.groupEnd();
              }}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug Info (Console)
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Helper function to categorize errors
function categorizeError(error: Error): string {
  if (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk")
  ) {
    return "chunk_load_error";
  }
  if (
    error.name === "TypeError" &&
    error.message.includes("Cannot read properties")
  ) {
    return "null_reference_error";
  }
  if (error.name === "NetworkError" || error.message.includes("fetch")) {
    return "network_error";
  }
  if (error.name === "SyntaxError") {
    return "syntax_error";
  }
  return "unknown_error";
}

export default EnhancedErrorBoundary;
