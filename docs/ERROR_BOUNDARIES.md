# Enhanced Error Boundary System

This document describes the comprehensive error boundary system implemented in the Yeko Admin application, providing robust error handling, structured logging, and enhanced user experience.

## Overview

The error boundary system consists of:

1. **Enhanced Error Boundary** - Advanced error boundary with retry logic and structured logging
2. **Specialized Error Boundaries** - Context-specific error boundaries for different use cases
3. **Error Logging Utilities** - Structured error logging with Better Stack and Sentry integration
4. **Global Error Handlers** - Unhandled error and promise rejection handlers

## Components

### EnhancedErrorBoundary

The main error boundary component with advanced features:

```typescript
import { EnhancedErrorBoundary } from "@/components/ErrorBoundary";

<EnhancedErrorBoundary
  componentName="MyComponent"
  maxRetries={3}
  retryDelay={1000}
  context={{ userId: "123", action: "data_load" }}
  logToBetterStack={true}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <YourComponent />
</EnhancedErrorBoundary>
```

**Features:**
- Automatic retry with exponential backoff
- Error categorization and severity assessment
- Structured logging to Better Stack and Sentry
- Error history tracking
- Custom fallback components
- Development mode debugging

### Specialized Error Boundaries

#### ApiErrorBoundary
For API-related components:

```typescript
import { ApiErrorBoundary } from "@/components/ErrorBoundary";

<ApiErrorBoundary endpoint="/api/users" method="GET">
  <UserList />
</ApiErrorBoundary>
```

#### AuthErrorBoundary
For authentication-related components:

```typescript
import { AuthErrorBoundary } from "@/components/ErrorBoundary";

<AuthErrorBoundary authContext="login">
  <LoginForm />
</AuthErrorBoundary>
```

#### DatabaseErrorBoundary
For database operations:

```typescript
import { DatabaseErrorBoundary } from "@/components/ErrorBoundary";

<DatabaseErrorBoundary operation="select" table="users">
  <UserData />
</DatabaseErrorBoundary>
```

#### FormErrorBoundary
For form components:

```typescript
import { FormErrorBoundary } from "@/components/ErrorBoundary";

<FormErrorBoundary formName="user-registration">
  <RegistrationForm />
</FormErrorBoundary>
```

#### PageErrorBoundary
For page-level error handling:

```typescript
import { PageErrorBoundary } from "@/components/ErrorBoundary";

<PageErrorBoundary pageName="dashboard">
  <DashboardPage />
</PageErrorBoundary>
```

#### ComponentErrorBoundary
For component-level error handling:

```typescript
import { ComponentErrorBoundary } from "@/components/ErrorBoundary";

<ComponentErrorBoundary componentName="UserCard" context={{ userId: "123" }}>
  <UserCard />
</ComponentErrorBoundary>
```

## Error Logging System

### EnhancedError Class

The `EnhancedError` class provides structured error handling:

```typescript
import { ErrorFactory } from "@/lib/error-logging";

// Create a component error
const error = ErrorFactory.component(
  "Failed to load user data",
  "UserProfile",
  { userId: "123" },
  originalError
);

// Capture to Sentry and Better Stack
const eventId = error.capture();
```

### Error Factory

Pre-configured error factories for common scenarios:

```typescript
// API errors
const apiError = ErrorFactory.api(
  "Request failed",
  "/api/users",
  "GET",
  500,
  { userId: "123" },
  originalError
);

// Authentication errors
const authError = ErrorFactory.auth(
  "Invalid credentials",
  "login",
  { attemptCount: 3 },
  originalError
);

// Database errors
const dbError = ErrorFactory.database(
  "Connection failed",
  "select",
  "users",
  { query: "SELECT * FROM users" },
  originalError
);

// Validation errors
const validationError = ErrorFactory.validation(
  "Email is required",
  "email",
  "registration",
  { formData: { name: "John" } },
  originalError
);
```

### useErrorBoundary Hook

React hook for error boundary functionality:

```typescript
import { useErrorBoundary } from "@/lib/error-logging";

function MyComponent() {
  const { captureError, captureComponentError, captureApiError } = useErrorBoundary();

  const handleApiCall = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      captureApiError(
        error as Error,
        "/api/data",
        "GET",
        response?.status,
        { userId: "123" }
      );
    }
  };

  return <div>...</div>;
}
```

## Global Error Handlers

Set up global error handling for unhandled errors:

```typescript
import { setupGlobalErrorHandlers } from "@/lib/error-logging";

// Call this once in your app initialization
setupGlobalErrorHandlers();
```

This will automatically capture:
- Unhandled promise rejections
- Uncaught JavaScript errors
- Global error events

## Error Categories and Severity

### Categories
- `ui` - User interface errors
- `api` - API communication errors
- `auth` - Authentication errors
- `database` - Database operation errors
- `network` - Network connectivity errors
- `validation` - Form validation errors
- `business_logic` - Business logic errors

### Severity Levels
- `low` - Minor issues, logged as debug
- `medium` - Moderate issues, logged as info
- `high` - Significant issues, logged as warn
- `critical` - Critical issues, logged as error

## Configuration

### Environment Variables

```bash
# Better Stack logging
BETTER_STACK_SOURCE_TOKEN=your_token_here

# Sentry configuration
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production

# Error boundary settings
NEXT_PUBLIC_ERROR_BOUNDARY_MAX_RETRIES=3
NEXT_PUBLIC_ERROR_BOUNDARY_RETRY_DELAY=1000
```

### Custom Configuration

```typescript
// Custom error boundary configuration
const errorBoundaryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  logToBetterStack: true,
  showDialog: true,
  context: {
    appVersion: "1.0.0",
    environment: process.env.NODE_ENV,
  },
};
```

## Best Practices

### 1. Use Appropriate Error Boundaries

- **Page-level**: Use `PageErrorBoundary` for entire pages
- **Component-level**: Use `ComponentErrorBoundary` for individual components
- **API calls**: Use `ApiErrorBoundary` for API-related components
- **Forms**: Use `FormErrorBoundary` for form components

### 2. Provide Meaningful Context

```typescript
<ComponentErrorBoundary
  componentName="UserProfile"
  context={{
    userId: user.id,
    userRole: user.role,
    page: "dashboard",
  }}
>
  <UserProfile />
</ComponentErrorBoundary>
```

### 3. Handle Different Error Types

```typescript
const handleError = (error: Error) => {
  if (error.name === "ChunkLoadError") {
    // Handle chunk loading errors
    window.location.reload();
  } else if (error.name === "NetworkError") {
    // Handle network errors
    showNetworkErrorToast();
  } else {
    // Handle other errors
    captureError(error);
  }
};
```

### 4. Use Error Factories

```typescript
// Instead of generic errors
throw new Error("Something went wrong");

// Use specific error factories
throw ErrorFactory.api("Request failed", "/api/users", "GET", 500);
```

### 5. Monitor Error Patterns

- Review error logs regularly
- Set up alerts for critical errors
- Monitor error rates and trends
- Use error fingerprints for grouping similar errors

## Testing Error Boundaries

### Unit Tests

```typescript
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

test("error boundary catches errors", () => {
  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  );

  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ApiErrorBoundary } from "@/components/ErrorBoundary";

test("api error boundary shows retry button", () => {
  render(
    <ApiErrorBoundary endpoint="/api/test" method="GET">
      <ThrowError shouldThrow={true} />
    </ApiErrorBoundary>
  );

  const retryButton = screen.getByText("Retry");
  expect(retryButton).toBeInTheDocument();
  
  fireEvent.click(retryButton);
  // Test retry functionality
});
```

## Monitoring and Alerting

### Sentry Integration

Errors are automatically sent to Sentry with:
- Error context and metadata
- User information
- Component stack traces
- Custom tags and fingerprints

### Better Stack Integration

Structured logs are sent to Better Stack with:
- Error severity and category
- Component information
- User context
- Timestamp and metadata

### Alerting Rules

Set up alerts for:
- High error rates
- Critical errors
- Authentication failures
- API failures
- Database errors

## Troubleshooting

### Common Issues

1. **Error boundary not catching errors**
   - Ensure the error is thrown during render
   - Check that the error boundary is properly nested
   - Verify the error is not caught by a parent boundary

2. **Infinite retry loops**
   - Check the `maxRetries` configuration
   - Ensure the error is not permanent
   - Review the retry delay settings

3. **Missing error context**
   - Provide meaningful context in error boundaries
   - Use error factories for structured errors
   - Include relevant metadata

### Debug Mode

Enable debug mode for development:

```typescript
<EnhancedErrorBoundary
  componentName="MyComponent"
  context={{ debug: true }}
>
  <MyComponent />
</EnhancedErrorBoundary>
```

This will provide additional console logging and error details.

## Migration Guide

### From Basic Error Boundaries

1. Replace basic error boundaries with enhanced versions
2. Add context and metadata
3. Configure retry logic
4. Set up structured logging

### Example Migration

```typescript
// Before
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// After
<ComponentErrorBoundary
  componentName="MyComponent"
  context={{ userId: user.id }}
>
  <MyComponent />
</ComponentErrorBoundary>
```

## Performance Considerations

- Error boundaries have minimal performance impact
- Retry logic includes exponential backoff
- Logging is asynchronous and non-blocking
- Error history is limited to prevent memory leaks

## Security Considerations

- Sensitive data is not logged in error messages
- User context is sanitized before logging
- Error details are only shown in development mode
- API keys and tokens are excluded from error context
