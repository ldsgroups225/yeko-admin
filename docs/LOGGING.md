# Logging System Documentation

This project uses [LogTape](https://github.com/dahlia/logtape) for structured logging with Better Stack integration for centralized log management.

## Overview

The logging system provides:
- **Structured logging** with consistent format across the application
- **Multiple transports** including console and Better Stack
- **Client-side logging** with server-side aggregation
- **Performance monitoring** and error tracking
- **Environment-specific configuration**

## Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# Better Stack configuration
BETTER_STACK_TOKEN=your_better_stack_token
BETTER_STACK_ENABLED=true  # Enable in development (optional)
BETTER_STACK_BATCH_SIZE=10  # Number of logs to batch (optional)
BETTER_STACK_FLUSH_INTERVAL=5000  # Flush interval in ms (optional)
```

### Better Stack Setup

1. Sign up at [Better Stack](https://betterstack.com/)
2. Create a new log source
3. Copy the source token to `BETTER_STACK_TOKEN`
4. Logs will automatically be sent to Better Stack in production

## Usage

### Server-Side Logging

Import the loggers from `@/lib/logger`:

```typescript
import { loggers } from '@/lib/logger';

// Application events
loggers.app.startup({ version: '1.0.0' });
loggers.app.error(new Error('Something went wrong'), { userId: '123' });

// Authentication events
loggers.auth.login('user123', { method: 'email' });
loggers.auth.loginFailed('user@example.com', 'Invalid password');

// API events
loggers.api.request('GET', '/api/users', { userId: '123' });
loggers.api.response('GET', '/api/users', 200, 150, { count: 10 });
loggers.api.error('POST', '/api/users', new Error('Validation failed'));

// Database events
loggers.db.query('SELECT * FROM users', 45, { table: 'users' });
loggers.db.error('INSERT INTO users', new Error('Constraint violation'));

// UI events (server-side rendering)
loggers.ui.performance('HomePage', 'render', 120, { userId: '123' });
```

### Client-Side Logging

Use the React hooks for client-side logging:

```typescript
import { useLogger, useApiLogger, useAuthLogger } from '@/hooks/useLogger';

function MyComponent() {
  const { logInteraction, logError, logPerformance } = useLogger('MyComponent');
  
  const handleClick = () => {
    logInteraction('button_click', { buttonId: 'submit' });
  };
  
  const handleError = (error: Error) => {
    logError(error, { context: 'form_submission' });
  };
  
  // Performance logging
  useEffect(() => {
    const start = performance.now();
    // ... component logic
    const duration = performance.now() - start;
    logPerformance('component_mount', duration);
  }, []);
}

// API logging
function useApiCall() {
  const { logRequest, logResponse, logError } = useApiLogger();
  
  const fetchData = async () => {
    const start = Date.now();
    logRequest('GET', '/api/data');
    
    try {
      const response = await fetch('/api/data');
      const duration = Date.now() - start;
      logResponse('GET', '/api/data', response.status, duration);
      return response.json();
    } catch (error) {
      logError('GET', '/api/data', error as Error);
      throw error;
    }
  };
}

// Authentication logging
function LoginForm() {
  const { logLogin, logLoginSuccess, logLoginFailure } = useAuthLogger();
  
  const handleLogin = async (email: string, password: string) => {
    logLogin('email', { email });
    
    try {
      const result = await signIn(email, password);
      logLoginSuccess(result.user.id, 'email');
    } catch (error) {
      logLoginFailure('email', error.message);
    }
  };
}
```

### Direct Logger Usage

For more control, use the logger instances directly:

```typescript
import { logger, authLogger, apiLogger, dbLogger, uiLogger, errorLogger } from '@/lib/logger';

// Basic logging
logger.info('Application started', { version: '1.0.0' });
logger.error('Critical error occurred', { error: error.message });

// Category-specific logging
authLogger.info('User authenticated', { userId: '123', method: 'oauth' });
apiLogger.debug('API call made', { endpoint: '/users', method: 'GET' });
dbLogger.warn('Slow query detected', { query: 'SELECT * FROM users', duration: 2000 });
uiLogger.info('Component rendered', { component: 'UserProfile', props: { userId: '123' } });
errorLogger.error('Unhandled exception', { error: error.stack });
```

## Log Levels

The system supports standard log levels:

- **debug**: Detailed information for debugging
- **info**: General information about application flow
- **warn**: Warning messages for potential issues
- **error**: Error messages for failures and exceptions

### Environment-Specific Levels

- **Development**: `debug` and above
- **Production**: `info` and above

## Log Structure

All logs follow a consistent structure:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "category": "auth",
  "message": "User login successful",
  "properties": {
    "userId": "123",
    "method": "email",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "app": "yeko-admin",
  "environment": "production",
  "version": "1.0.0"
}
```

## Better Stack Integration

### Features

- **Automatic batching**: Logs are batched for efficient transmission
- **Error handling**: Failed log transmissions are retried
- **Environment filtering**: Only production logs are sent by default
- **Structured data**: Full log context is preserved

### Dashboard

In Better Stack, you can:
- Search and filter logs by level, category, or properties
- Set up alerts for error conditions
- Create dashboards for monitoring
- Export logs for analysis

### Querying Logs

Example Better Stack queries:

```
# Find all authentication errors
level:error AND category:auth

# Find slow API responses
category:api AND properties.duration:>1000

# Find errors for specific user
properties.userId:123 AND level:error

# Find UI performance issues
category:ui AND properties.metric:render AND properties.value:>500
```

## Performance Considerations

### Batching

Logs are automatically batched to reduce API calls:
- Default batch size: 10 logs
- Default flush interval: 5 seconds
- Configurable via environment variables

### Memory Usage

- Logs are held in memory until flushed
- Failed transmissions are retried with exponential backoff
- Memory usage scales with batch size and retry attempts

### Network Impact

- Only production logs are sent to Better Stack by default
- Client-side logs are sent asynchronously
- Failed requests don't block application flow

## Troubleshooting

### Logs Not Appearing in Better Stack

1. Check `BETTER_STACK_TOKEN` is set correctly
2. Verify network connectivity to Better Stack
3. Check console for transmission errors
4. Ensure `NODE_ENV=production` or `BETTER_STACK_ENABLED=true`

### High Memory Usage

1. Reduce `BETTER_STACK_BATCH_SIZE`
2. Reduce `BETTER_STACK_FLUSH_INTERVAL`
3. Check for failed transmissions causing log accumulation

### Missing Context

1. Ensure proper logger category usage
2. Add relevant properties to log calls
3. Check middleware is properly configured

## Best Practices

### Do's

- Use appropriate log levels
- Include relevant context in properties
- Use category-specific loggers
- Log user actions for audit trails
- Log performance metrics
- Log errors with full context

### Don'ts

- Don't log sensitive information (passwords, tokens)
- Don't log excessively in tight loops
- Don't use console.log directly in production code
- Don't ignore failed log transmissions
- Don't log large objects without filtering

### Security

- Sensitive data is automatically filtered
- IP addresses and user agents are logged for security
- Authentication events are tracked
- Error logs include stack traces (filtered for sensitive data)

## Migration from Console Logging

Replace console logging with structured logging:

```typescript
// Before
console.log('User logged in:', userId);
console.error('API error:', error);

// After
loggers.auth.login(userId, { method: 'email' });
loggers.api.error('POST', '/api/login', error, { userId });
```

This provides better structure, context, and centralized management of your application logs.