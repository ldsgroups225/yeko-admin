# Sentry Error Monitoring Documentation

This project uses [Sentry](https://sentry.io/) for comprehensive error tracking, performance monitoring, and session replay.

## Overview

The Sentry integration provides:
- **Error tracking** with detailed stack traces and context
- **Performance monitoring** for API calls and page loads
- **Session replay** for debugging user interactions
- **Release tracking** with source maps for better debugging
- **Custom error boundaries** for graceful error handling
- **User context** tracking for better error attribution

## Setup

### 1. Sentry Project Setup

1. Create a Sentry account at [sentry.io](https://sentry.io/)
2. Create a new project for your Next.js application
3. Copy the DSN from your project settings
4. Add the DSN to your environment variables

### 2. Environment Configuration

Add these variables to your `.env.local` file:

```bash
# Required for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional: For source map uploads (recommended for production)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug

# Optional: Disable Sentry in specific environments
NEXT_PUBLIC_SENTRY_DISABLED=false
```

### 3. Source Maps (Recommended)

For better error tracking in production, set up source map uploads:

1. Create a Sentry auth token with `project:releases` scope
2. Add it to your deployment environment as `SENTRY_AUTH_TOKEN`
3. Source maps will be automatically uploaded during build

## Configuration Files

The project includes three Sentry configuration files:

- **`sentry.client.config.ts`**: Client-side configuration with session replay
- **`sentry.server.config.ts`**: Server-side configuration with Node.js integrations
- **`sentry.edge.config.ts`**: Edge runtime configuration (minimal)

## Usage

### Error Boundaries

Use the provided error boundary components to catch and handle React errors:

```typescript
import ErrorBoundary, { PageErrorBoundary, ComponentErrorBoundary } from '@/components/ErrorBoundary';

// Page-level error boundary
function MyPage() {
  return (
    <PageErrorBoundary>
      <YourPageContent />
    </PageErrorBoundary>
  );
}

// Component-level error boundary
function MyComponent() {
  return (
    <ComponentErrorBoundary componentName="MyComponent">
      <YourComponent />
    </ComponentErrorBoundary>
  );
}

// Custom error boundary
function CustomComponent() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling
        console.log('Custom error handler:', error);
      }}
      fallback={({ error, resetError }) => (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### React Hooks

Use the provided hooks for enhanced error tracking:

```typescript
import { 
  useSentryComponent, 
  useSentryUser, 
  useSentryPerformance,
  useSentryApi,
  useSentryForm 
} from '@/hooks/useSentry';

// Component-level tracking
function MyComponent() {
  const { captureError, captureMessage, addBreadcrumb } = useSentryComponent('MyComponent');
  
  const handleError = (error: Error) => {
    captureError(error, { context: 'button_click' });
  };
  
  const handleSuccess = () => {
    captureMessage('Operation completed successfully');
    addBreadcrumb('User completed action', { action: 'submit' });
  };
}

// User context management
function AuthComponent() {
  const { setUser, clearUser } = useSentryUser();
  
  const handleLogin = (user) => {
    setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  };
  
  const handleLogout = () => {
    clearUser();
  };
}

// Performance monitoring
function PerformanceComponent() {
  const { measureFunction, measureApiCall, measureRender } = useSentryPerformance();
  
  useEffect(() => {
    const endMeasure = measureRender('PerformanceComponent');
    return endMeasure;
  }, []);
  
  const handleApiCall = async () => {
    await measureApiCall('GET', '/api/data', async () => {
      return fetch('/api/data').then(r => r.json());
    });
  };
}

// API error tracking
function ApiComponent() {
  const { trackApiCall, captureApiError } = useSentryApi();
  
  const fetchData = async () => {
    try {
      const data = await trackApiCall('GET', '/api/users', async () => {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('API call failed');
        return response.json();
      });
      return data;
    } catch (error) {
      captureApiError('GET', '/api/users', error, {
        status: error.status,
        response: error.response,
      });
      throw error;
    }
  };
}

// Form error tracking
function FormComponent() {
  const { captureValidationError, captureSubmissionError, trackFormInteraction } = useSentryForm('ContactForm');
  
  const handleSubmit = async (formData) => {
    trackFormInteraction('submit');
    
    try {
      await submitForm(formData);
    } catch (error) {
      if (error.type === 'validation') {
        captureValidationError(error.field, error.message, formData);
      } else {
        captureSubmissionError(error, formData);
      }
      throw error;
    }
  };
}
```

### Direct Sentry Utilities

For more control, use the Sentry utilities directly:

```typescript
import { sentryUtils, AppError, ErrorCategory } from '@/lib/sentry';

// Capture exceptions with context
sentryUtils.captureException(new Error('Something went wrong'), {
  user: { id: '123', email: 'user@example.com' },
  tags: { feature: 'checkout', version: '1.0.0' },
  extra: { orderId: '12345', amount: 99.99 },
  level: 'error',
});

// Capture messages
sentryUtils.captureMessage('User completed checkout', {
  level: 'info',
  tags: { feature: 'checkout' },
  extra: { orderId: '12345' },
});

// Set user context
sentryUtils.setUser({
  id: '123',
  email: 'user@example.com',
  username: 'johndoe',
});

// Add breadcrumbs
sentryUtils.addBreadcrumb({
  message: 'User clicked checkout button',
  category: 'ui',
  level: 'info',
  data: { buttonId: 'checkout', amount: 99.99 },
});

// Set context
sentryUtils.setContext('order', {
  id: '12345',
  amount: 99.99,
  items: ['item1', 'item2'],
});

// Set tags
sentryUtils.setTags({
  feature: 'checkout',
  version: '1.0.0',
  userType: 'premium',
});
```

### Custom Error Classes

Use the provided error classes for better categorization:

```typescript
import { AppError, ErrorCategory, AuthenticationError, ValidationError } from '@/lib/sentry';

// Generic application error
throw new AppError(
  'Failed to process payment',
  ErrorCategory.BUSINESS_LOGIC,
  {
    code: 'PAYMENT_FAILED',
    statusCode: 400,
    context: { orderId: '12345', amount: 99.99 },
  }
);

// Specific error types
throw new AuthenticationError('Invalid credentials', {
  code: 'INVALID_CREDENTIALS',
  context: { email: 'user@example.com' },
});

throw new ValidationError('Email is required', {
  code: 'REQUIRED_FIELD',
  context: { field: 'email' },
});
```

## Features

### Error Tracking

- **Automatic error capture** for unhandled exceptions
- **React error boundaries** with custom fallbacks
- **Enhanced error context** with user, tags, and extra data
- **Error filtering** to reduce noise
- **Source maps** for better stack traces in production

### Performance Monitoring

- **Automatic performance tracking** for page loads and navigation
- **API call monitoring** with timing and error tracking
- **Custom performance measurements** for critical operations
- **Database query tracking** (when integrated)

### Session Replay

- **Automatic session recording** on errors
- **Manual replay capture** for debugging
- **Privacy controls** with data masking
- **Replay context** with custom data

### User Context

- **Automatic user tracking** when authenticated
- **Custom user properties** for better error attribution
- **User session management** with login/logout tracking

### Release Tracking

- **Automatic release detection** from package.json version
- **Source map uploads** for better error debugging
- **Release health monitoring** with error rates and crash statistics

## Best Practices

### Do's

- Use error boundaries to catch React errors gracefully
- Set user context when users authenticate
- Add relevant tags and context to errors
- Use custom error classes for better categorization
- Monitor performance of critical user journeys
- Filter out expected errors and noise

### Don'ts

- Don't log sensitive information (passwords, tokens, PII)
- Don't capture every single error (filter appropriately)
- Don't ignore Sentry performance impact in development
- Don't forget to test error boundaries
- Don't expose Sentry auth tokens in client code

### Security

- Sentry DSN is safe to expose in client code
- Source maps are uploaded securely and not exposed to users
- Sensitive data is automatically filtered from error reports
- User context should not include sensitive information

## Monitoring and Alerts

### Sentry Dashboard

Monitor your application health through:
- **Error tracking** with frequency and impact analysis
- **Performance monitoring** with slow transaction detection
- **Release health** with crash-free session rates
- **User feedback** integration for error reports

### Alerts

Set up alerts for:
- New error types or spikes in error rates
- Performance degradation in critical paths
- High error rates for specific releases
- User-reported issues through feedback

### Integrations

Sentry integrates with:
- **Slack/Discord** for real-time error notifications
- **GitHub** for linking errors to commits and releases
- **Jira** for automatic issue creation
- **PagerDuty** for critical error escalation

## Troubleshooting

### Common Issues

1. **Errors not appearing in Sentry**
   - Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
   - Verify Sentry is not disabled (`NEXT_PUBLIC_SENTRY_DISABLED`)
   - Check browser console for Sentry initialization errors

2. **Source maps not working**
   - Ensure `SENTRY_ORG` and `SENTRY_PROJECT` are set
   - Verify `SENTRY_AUTH_TOKEN` is available during build
   - Check build logs for source map upload status

3. **Too many errors**
   - Implement proper error filtering in `beforeSend`
   - Use error boundaries to catch and handle expected errors
   - Adjust sample rates for performance monitoring

4. **Missing user context**
   - Ensure `setUser` is called after authentication
   - Check that user context is cleared on logout
   - Verify user data doesn't contain sensitive information

### Debug Mode

Enable debug mode in development:

```typescript
// In sentry.client.config.ts or sentry.server.config.ts
debug: process.env.NODE_ENV === 'development',
```

This will log Sentry operations to the console for debugging.

## Migration from Other Error Tracking

If migrating from other error tracking solutions:

1. **From Bugsnag**: Similar concepts, but different API
2. **From LogRocket**: Sentry provides session replay as well
3. **From Rollbar**: Similar error tracking with different configuration
4. **From console.error**: Replace with structured error reporting

The enhanced error tracking provides better debugging capabilities, user context, and integration with your development workflow.