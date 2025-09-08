"use client";

import * as Sentry from "@sentry/nextjs";
import {
  AlertTriangle,
  Database,
  Globe,
  Lock,
  RefreshCw,
  Users,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loggers } from "@/lib/logger";
import EnhancedErrorBoundary from "./EnhancedErrorBoundary";

// API Error Boundary for API-related components
export function ApiErrorBoundary({
  children,
  endpoint,
  method,
}: {
  children: React.ReactNode;
  endpoint?: string;
  method?: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="ApiErrorBoundary"
      context={{ endpoint, method }}
      onError={(error, errorInfo) => {
        // Add API-specific context
        Sentry.setTag("errorContext", "api");
        Sentry.setTag("endpoint", endpoint || "unknown");
        Sentry.setTag("method", method || "unknown");
        Sentry.setContext("api", {
          endpoint,
          method,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.api.error(method || "GET", endpoint || "unknown", error, {
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError, eventId, retryCount, canRetry }) => (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-lg">API Error</CardTitle>
            <CardDescription>
              Failed to load data from {endpoint || "the server"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs">
                API_ERROR
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {error.message}
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Retry attempt {retryCount}
              </p>
            )}
            {eventId && (
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {eventId}
              </p>
            )}
          </CardContent>
          <div className="p-4 pt-0">
            {canRetry && (
              <Button onClick={resetError} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </Card>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Authentication Error Boundary
export function AuthErrorBoundary({
  children,
  authContext,
}: {
  children: React.ReactNode;
  authContext?: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="AuthErrorBoundary"
      context={{ authContext }}
      onError={(error, errorInfo) => {
        // Add auth-specific context
        Sentry.setTag("errorContext", "auth");
        Sentry.setTag("authContext", authContext || "unknown");
        Sentry.setContext("auth", {
          context: authContext,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "auth",
          authContext,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError, eventId }) => (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-lg">Authentication Error</CardTitle>
            <CardDescription>
              There was a problem with authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="destructive" className="text-xs">
                AUTH_ERROR
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {error.message}
            </p>
            {eventId && (
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {eventId}
              </p>
            )}
          </CardContent>
          <div className="p-4 pt-0 space-y-2">
            <Button onClick={resetError} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => {
                window.location.href = "/sign-in";
              }}
              className="w-full"
              variant="default"
            >
              Sign In
            </Button>
          </div>
        </Card>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Database Error Boundary
export function DatabaseErrorBoundary({
  children,
  operation,
  table,
}: {
  children: React.ReactNode;
  operation?: string;
  table?: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="DatabaseErrorBoundary"
      context={{ operation, table }}
      onError={(error, errorInfo) => {
        // Add database-specific context
        Sentry.setTag("errorContext", "database");
        Sentry.setTag("operation", operation || "unknown");
        Sentry.setTag("table", table || "unknown");
        Sentry.setContext("database", {
          operation,
          table,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "database",
          operation,
          table,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError, eventId, canRetry }) => (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Database Error</CardTitle>
            <CardDescription>
              Failed to {operation || "access"} {table || "data"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs">
                DATABASE_ERROR
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {error.message}
            </p>
            {eventId && (
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {eventId}
              </p>
            )}
          </CardContent>
          <div className="p-4 pt-0">
            {canRetry && (
              <Button onClick={resetError} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </Card>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// User Management Error Boundary
export function UserManagementErrorBoundary({
  children,
  userContext,
}: {
  children: React.ReactNode;
  userContext?: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="UserManagementErrorBoundary"
      context={{ userContext }}
      onError={(error, errorInfo) => {
        // Add user management context
        Sentry.setTag("errorContext", "user_management");
        Sentry.setTag("userContext", userContext || "unknown");
        Sentry.setContext("user_management", {
          context: userContext,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "user_management",
          userContext,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError, eventId, canRetry }) => (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">User Management Error</CardTitle>
            <CardDescription>
              There was a problem managing user data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs">
                USER_ERROR
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {error.message}
            </p>
            {eventId && (
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {eventId}
              </p>
            )}
          </CardContent>
          <div className="p-4 pt-0">
            {canRetry && (
              <Button onClick={resetError} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </Card>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Form Error Boundary
export function FormErrorBoundary({
  children,
  formName,
}: {
  children: React.ReactNode;
  formName: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="FormErrorBoundary"
      context={{ formName }}
      onError={(error, errorInfo) => {
        // Add form-specific context
        Sentry.setTag("errorContext", "form");
        Sentry.setTag("formName", formName);
        Sentry.setContext("form", {
          name: formName,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "form",
          formName,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={({ error, resetError, eventId, canRetry }) => (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Form Error: {formName}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error.message}
              </p>
              {eventId && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Error ID: {eventId}
                </p>
              )}
            </div>
            {canRetry && (
              <Button
                onClick={resetError}
                variant="ghost"
                size="sm"
                className="text-red-800 hover:text-red-900 dark:text-red-200"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Page-level Error Boundary with enhanced features
export function PageErrorBoundary({
  children,
  pageName,
}: {
  children: React.ReactNode;
  pageName?: string;
}) {
  return (
    <EnhancedErrorBoundary
      componentName="PageErrorBoundary"
      context={{ pageName }}
      onError={(error, errorInfo) => {
        // Add page-specific context
        Sentry.setTag("errorContext", "page");
        Sentry.setTag("pageName", pageName || "unknown");
        Sentry.setContext("page", {
          name: pageName,
          url: typeof window !== "undefined" ? window.location.href : undefined,
          pathname:
            typeof window !== "undefined"
              ? window.location.pathname
              : undefined,
          search:
            typeof window !== "undefined" ? window.location.search : undefined,
          timestamp: new Date().toISOString(),
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "page",
          pageName,
          url: typeof window !== "undefined" ? window.location.href : undefined,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Component-level Error Boundary with enhanced features
export function ComponentErrorBoundary({
  children,
  componentName,
  context,
}: {
  children: React.ReactNode;
  componentName: string;
  context?: Record<string, unknown>;
}) {
  return (
    <EnhancedErrorBoundary
      componentName={componentName}
      context={context}
      onError={(error, errorInfo) => {
        // Add component-specific context
        Sentry.setTag("errorContext", "component");
        Sentry.setTag("componentName", componentName);
        Sentry.setContext("component", {
          name: componentName,
          stack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          ...context,
        });

        // Log to Better Stack
        loggers.app.error(error, {
          category: "component",
          componentName,
          errorMessage: error.message,
          componentStack: errorInfo.componentStack,
          ...context,
        });
      }}
      fallback={({ error, resetError, eventId, canRetry }) => (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Component Error: {componentName}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error.message}
              </p>
              {eventId && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Error ID: {eventId}
                </p>
              )}
            </div>
            {canRetry && (
              <Button
                onClick={resetError}
                variant="ghost"
                size="sm"
                className="text-red-800 hover:text-red-900 dark:text-red-200"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}
