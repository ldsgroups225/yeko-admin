import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  AppError,
  ErrorCategory,
  performanceUtils,
  sentryUtils,
} from "@/lib/sentry";

// Hook for component-level error tracking
export function useSentryComponent(componentName: string) {
  useEffect(() => {
    // Set component context
    sentryUtils.setContext("component", {
      name: componentName,
      mountedAt: new Date().toISOString(),
    });

    sentryUtils.addBreadcrumb({
      message: `Component ${componentName} mounted`,
      category: "ui",
      level: "info",
    });

    return () => {
      sentryUtils.addBreadcrumb({
        message: `Component ${componentName} unmounted`,
        category: "ui",
        level: "info",
      });
    };
  }, [componentName]);

  const captureError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      return sentryUtils.captureException(error, {
        tags: {
          component: componentName,
          errorType: "component",
        },
        extra: context,
      });
    },
    [componentName],
  );

  const captureMessage = useCallback(
    (message: string, level: "info" | "warning" | "error" = "info") => {
      return sentryUtils.captureMessage(message, {
        level,
        tags: {
          component: componentName,
        },
      });
    },
    [componentName],
  );

  const addBreadcrumb = useCallback(
    (message: string, data?: Record<string, unknown>) => {
      sentryUtils.addBreadcrumb({
        message,
        category: "ui",
        data: {
          component: componentName,
          ...data,
        },
      });
    },
    [componentName],
  );

  return {
    captureError,
    captureMessage,
    addBreadcrumb,
  };
}

// Hook for user context management
export function useSentryUser() {
  const setUser = useCallback(
    (user: {
      id: string;
      email?: string;
      username?: string;
      [key: string]: unknown;
    }) => {
      sentryUtils.setUser(user);
      sentryUtils.addBreadcrumb({
        message: "User context set",
        category: "auth",
        data: { userId: user.id },
      });
    },
    [],
  );

  const clearUser = useCallback(() => {
    sentryUtils.clearUser();
    sentryUtils.addBreadcrumb({
      message: "User context cleared",
      category: "auth",
    });
  }, []);

  return {
    setUser,
    clearUser,
  };
}

// Hook for performance monitoring
export function useSentryPerformance() {
  const measureFunction = useCallback(
    async <T>(
      name: string,
      fn: () => Promise<T> | T,
      tags?: Record<string, string>,
    ): Promise<T> => {
      return performanceUtils.measureFunction(name, fn, tags);
    },
    [],
  );

  const measureApiCall = useCallback(
    async <T>(
      method: string,
      url: string,
      fn: () => Promise<T>,
    ): Promise<T> => {
      return performanceUtils.measureApiCall(method, url, fn);
    },
    [],
  );

  const measureRender = useCallback((componentName: string) => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      sentryUtils.addBreadcrumb({
        message: `Component ${componentName} render completed`,
        category: "ui.performance",
        data: {
          component: componentName,
          renderTime: duration,
        },
      });
    };
  }, []);

  return {
    measureFunction,
    measureApiCall,
    measureRender,
  };
}

// Hook for navigation tracking
export function useSentryNavigation() {
  const _router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      sentryUtils.addBreadcrumb({
        message: "Navigation",
        category: "navigation",
        data: {
          to: url,
          timestamp: new Date().toISOString(),
        },
      });

      sentryUtils.setContext("navigation", {
        currentUrl: url,
        timestamp: new Date().toISOString(),
      });
    };

    // Track initial page load
    handleRouteChange(window.location.pathname);

    // Note: Next.js 13+ app router doesn't have a direct route change event
    // You might need to implement this differently based on your routing setup

    return () => {
      // Cleanup if needed
    };
  }, []);
}

// Hook for API error handling
export function useSentryApi() {
  const captureApiError = useCallback(
    (
      method: string,
      url: string,
      error: Error,
      context?: {
        status?: number;
        response?: unknown;
        requestData?: unknown;
      },
    ) => {
      const apiError = new AppError(
        `API Error: ${method} ${url} - ${error.message}`,
        ErrorCategory.EXTERNAL_API,
        {
          code: "API_ERROR",
          statusCode: context?.status,
          context: {
            method,
            url,
            response: context?.response,
            requestData: context?.requestData,
          },
          cause: error,
        },
      );

      return apiError.eventId;
    },
    [],
  );

  const trackApiCall = useCallback(
    async <T>(
      method: string,
      url: string,
      apiCall: () => Promise<T>,
      requestData?: unknown,
    ): Promise<T> => {
      sentryUtils.addBreadcrumb({
        message: `API call started: ${method} ${url}`,
        category: "http",
        data: {
          method,
          url,
          requestData,
        },
      });

      try {
        const result = await performanceUtils.measureApiCall(
          method,
          url,
          apiCall,
        );

        sentryUtils.addBreadcrumb({
          message: `API call successful: ${method} ${url}`,
          category: "http",
          level: "info",
        });

        return result;
      } catch (error) {
        captureApiError(method, url, error as Error, { requestData });
        throw error;
      }
    },
    [captureApiError],
  );

  return {
    captureApiError,
    trackApiCall,
  };
}

// Hook for form error tracking
export function useSentryForm(formName: string) {
  const captureValidationError = useCallback(
    (field: string, error: string, formData?: Record<string, unknown>) => {
      const validationError = new AppError(
        `Form validation error in ${formName}: ${field} - ${error}`,
        ErrorCategory.VALIDATION,
        {
          code: "FORM_VALIDATION_ERROR",
          context: {
            form: formName,
            field,
            formData: formData ? Object.keys(formData) : undefined, // Don't log actual form data
          },
        },
      );

      return validationError.eventId;
    },
    [formName],
  );

  const captureSubmissionError = useCallback(
    (error: Error, formData?: Record<string, unknown>) => {
      const submissionError = new AppError(
        `Form submission error in ${formName}: ${error.message}`,
        ErrorCategory.BUSINESS_LOGIC,
        {
          code: "FORM_SUBMISSION_ERROR",
          context: {
            form: formName,
            formData: formData ? Object.keys(formData) : undefined, // Don't log actual form data
          },
          cause: error,
        },
      );

      return submissionError.eventId;
    },
    [formName],
  );

  const trackFormInteraction = useCallback(
    (action: string, field?: string) => {
      sentryUtils.addBreadcrumb({
        message: `Form interaction: ${action}`,
        category: "ui.form",
        data: {
          form: formName,
          action,
          field,
        },
      });
    },
    [formName],
  );

  return {
    captureValidationError,
    captureSubmissionError,
    trackFormInteraction,
  };
}
