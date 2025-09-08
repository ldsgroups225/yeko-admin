"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDialog?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  eventId?: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Send to Sentry with additional context
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: true,
        component: this.constructor.name,
      },
      extra: {
        errorInfo,
        props: this.props,
      },
    });

    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      eventId: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error || new Error("Unknown error")}
          resetError={this.resetError}
          eventId={this.state.eventId}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  resetError,
  eventId,
}: ErrorFallbackProps) {
  const handleReportFeedback = () => {
    if (eventId) {
      Sentry.showReportDialog({ eventId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. We've been notified and are working to
            fix it.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <details className="rounded-md bg-gray-50 dark:bg-gray-900 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                {error.message}
                {"\n\n"}
                {error.stack}
              </pre>
            </details>
          )}

          {eventId && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Error ID:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                {eventId}
              </code>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button onClick={resetError} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
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
            >
              Report Feedback
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Specialized error boundaries for different contexts
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(_error, _errorInfo) => {
        // Add page-specific context
        Sentry.setTag("errorContext", "page");
        Sentry.setContext("page", {
          url: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({
  children,
  componentName,
}: {
  children: React.ReactNode;
  componentName: string;
}) {
  return (
    <ErrorBoundary
      onError={(_error, _errorInfo) => {
        // Add component-specific context
        Sentry.setTag("errorContext", "component");
        Sentry.setTag("componentName", componentName);
        Sentry.setContext("component", {
          name: componentName,
          stack: _errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError }) => (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Component Error: {componentName}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error.message}
              </p>
              <Button
                onClick={resetError}
                variant="ghost"
                size="sm"
                className="mt-2 text-red-800 hover:text-red-900 dark:text-red-200"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
