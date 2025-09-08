# Checkly Monitoring Configuration

This document provides comprehensive guidance for setting up and configuring Checkly monitoring for the Yeko Admin application endpoints and user journeys.

## Overview

Checkly provides synthetic monitoring capabilities for API endpoints and browser-based user journeys. This guide covers endpoint monitoring, user journey testing, and alerting configuration.

## Configuration

### 1. Environment Variables

Add these variables to your environment configuration:

```bash
# Checkly Configuration
CHECKLY_PROJECT_NAME=yeko-admin
CHECKLY_LOGICAL_ID=yeko-admin-monitoring
CHECKLY_EMAIL_ADDRESS=alerts@yeko.com
CHECKLY_SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
CHECKLY_WEBHOOK_URL=https://your-webhook-endpoint.com/checkly
CHECKLY_API_TOKEN=your_api_token_for_authenticated_checks

# Application URLs
ENVIRONMENT_URL=https://yeko-admin.vercel.app
NEXT_PUBLIC_APP_URL=https://yeko-admin.vercel.app
VERCEL_BYPASS_TOKEN=your_vercel_bypass_token

# GitHub Integration
GITHUB_REPOSITORY_URL=https://github.com/yeko/yeko-admin
```

### 2. Monitoring Setup

#### API Endpoint Monitoring

The configuration includes monitoring for critical API endpoints:

**Authentication Endpoints**
- Sign-in endpoint monitoring
- Expected 401 response for invalid credentials
- Response time monitoring (< 2 seconds)

**Health Check Endpoint**
- Application health status
- Response time monitoring (< 1 second)
- JSON response validation

**Data API Endpoints**
- Users API endpoint monitoring
- Schools API endpoint monitoring
- Response time monitoring (< 3 seconds)
- Authentication token validation

#### Browser-Based Monitoring

**Critical User Journeys**
- Homepage accessibility testing
- Authentication flow validation
- Dashboard functionality testing

**Monitoring Frequency**
- Health checks: Every 1 minute
- Authentication: Every 5 minutes
- API endpoints: Every 10 minutes
- User journeys: Every 30 minutes to 1 hour

### 3. Alert Channels

#### Email Alerts
```typescript
const emailChannel = new EmailAlertChannel("email-channel-1", {
  address: process.env.CHECKLY_EMAIL_ADDRESS ?? "",
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
});
```

#### Slack Integration
```typescript
const slackChannel = new SlackAlertChannel("slack-channel-1", {
  webhookUrl: process.env.CHECKLY_SLACK_WEBHOOK ?? "",
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
});
```

#### Webhook Integration
```typescript
const webhookChannel = new WebhookAlertChannel("webhook-channel-1", {
  url: process.env.CHECKLY_WEBHOOK_URL ?? "",
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
});
```

## Monitoring Checks

### 1. API Checks

#### Health Check Endpoint
```typescript
new ApiCheck("health-check", {
  name: "Health Check Endpoint",
  group: apiChecks,
  request: {
    method: "GET",
    url: `${process.env.ENVIRONMENT_URL}/api/health`,
  },
  assertions: [
    {
      source: "STATUS_CODE",
      property: "",
      comparison: "EQUAL",
      target: 200,
    },
    {
      source: "JSON_BODY",
      property: "status",
      comparison: "EQUAL",
      target: "healthy",
    },
    {
      source: "RESPONSE_TIME",
      property: "",
      comparison: "LESS_THAN",
      target: 1000,
    },
  ],
  frequency: Frequency.EVERY_1M,
  tags: ["health", "critical"],
});
```

#### Authentication Endpoint
```typescript
new ApiCheck("auth-signin", {
  name: "Sign In Endpoint",
  group: apiChecks,
  request: {
    method: "POST",
    url: `${process.env.ENVIRONMENT_URL}/api/auth/signin`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test@example.com",
      password: "testpassword",
    }),
  },
  assertions: [
    {
      source: "STATUS_CODE",
      property: "",
      comparison: "EQUAL",
      target: 401, // Expected to fail with invalid credentials
    },
    {
      source: "RESPONSE_TIME",
      property: "",
      comparison: "LESS_THAN",
      target: 2000,
    },
  ],
  frequency: Frequency.EVERY_5M,
  tags: ["auth", "critical"],
});
```

### 2. Browser Checks

#### Homepage Accessibility
```typescript
new BrowserCheck("homepage-check", {
  name: "Homepage Accessibility",
  group: browserChecks,
  code: {
    entrypoint: "tests/e2e/homepage.check.e2e.ts",
  },
  frequency: Frequency.EVERY_30M,
  tags: ["homepage", "accessibility"],
});
```

#### Authentication Flow
```typescript
new BrowserCheck("auth-flow-check", {
  name: "Authentication Flow",
  group: browserChecks,
  code: {
    entrypoint: "tests/e2e/auth.check.e2e.ts",
  },
  frequency: Frequency.EVERY_1H,
  tags: ["auth", "critical"],
});
```

## Test Files

### 1. Homepage Check Test

Create `tests/e2e/homepage.check.e2e.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('Homepage accessibility and functionality', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/Yeko Admin/);
  
  // Check for main navigation
  await expect(page.locator('nav')).toBeVisible();
  
  // Check for sign-in button
  await expect(page.locator('a[href="/sign-in"]')).toBeVisible();
  
  // Check for accessibility features
  await expect(page.locator('html')).toHaveAttribute('lang');
  
  // Check for proper heading structure
  await expect(page.locator('h1')).toBeVisible();
  
  // Check for meta description
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content');
  
  // Check for favicon
  const favicon = page.locator('link[rel="icon"]');
  await expect(favicon).toBeVisible();
  
  // Check for no console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Assert no console errors
  expect(errors).toHaveLength(0);
});
```

### 2. Authentication Flow Test

Create `tests/e2e/auth.check.e2e.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('Authentication flow functionality', async ({ page }) => {
  // Navigate to sign-in page
  await page.goto('/sign-in');
  
  // Check page title
  await expect(page).toHaveTitle(/Sign In/);
  
  // Check for email input
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
  
  // Check for password input
  const passwordInput = page.locator('input[type="password"]');
  await expect(passwordInput).toBeVisible();
  
  // Check for sign-in button
  const signInButton = page.locator('button[type="submit"]');
  await expect(signInButton).toBeVisible();
  
  // Check for Google sign-in button
  const googleButton = page.locator('button:has-text("Google")');
  await expect(googleButton).toBeVisible();
  
  // Check for forgot password link
  const forgotPasswordLink = page.locator('a[href="/forgot-password"]');
  await expect(forgotPasswordLink).toBeVisible();
  
  // Test form validation
  await signInButton.click();
  
  // Check for validation messages
  await expect(page.locator('text=Email is required')).toBeVisible();
  await expect(page.locator('text=Password is required')).toBeVisible();
  
  // Test invalid credentials
  await emailInput.fill('invalid@example.com');
  await passwordInput.fill('wrongpassword');
  await signInButton.click();
  
  // Check for error message
  await expect(page.locator('text=Invalid credentials')).toBeVisible();
  
  // Check for accessibility
  await expect(emailInput).toHaveAttribute('aria-label');
  await expect(passwordInput).toHaveAttribute('aria-label');
});
```

### 3. Dashboard Functionality Test

Create `tests/e2e/dashboard.check.e2e.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('Dashboard functionality', async ({ page }) => {
  // This test would require authentication
  // For monitoring purposes, we'll check the dashboard page structure
  
  // Navigate to dashboard (this will redirect to sign-in if not authenticated)
  await page.goto('/dashboard');
  
  // Check if redirected to sign-in (expected behavior)
  await expect(page).toHaveURL(/sign-in/);
  
  // Check for proper redirect handling
  await expect(page.locator('text=Please sign in to continue')).toBeVisible();
  
  // Check for return URL parameter
  const currentUrl = page.url();
  expect(currentUrl).toContain('redirectTo=/dashboard');
});
```

## Alerting Configuration

### 1. Alert Severity Levels

#### Critical Alerts
- Health check failures
- Authentication endpoint failures
- Database connection issues
- Application crashes

#### High Priority Alerts
- API endpoint timeouts
- Slow response times
- User journey failures
- Performance degradation

#### Medium Priority Alerts
- Non-critical endpoint failures
- Warning conditions
- Maintenance notifications

### 2. Notification Channels

#### Email Notifications
- Immediate alerts for critical issues
- Daily summary reports
- Weekly performance reports

#### Slack Integration
- Real-time alerts in dedicated channels
- Rich notifications with context
- Team collaboration on incidents

#### Webhook Integration
- Integration with external systems
- Custom alert processing
- Automated incident creation

### 3. Alert Thresholds

#### Response Time Thresholds
- Health checks: < 1 second
- Authentication: < 2 seconds
- API endpoints: < 3 seconds
- User journeys: < 10 seconds

#### Availability Thresholds
- Critical endpoints: 99.9% uptime
- Important endpoints: 99.5% uptime
- Standard endpoints: 99% uptime

## Monitoring Best Practices

### 1. Check Design

#### API Checks
- Use realistic test data
- Test both success and failure scenarios
- Include response time assertions
- Validate response structure

#### Browser Checks
- Test critical user journeys
- Include accessibility checks
- Monitor for console errors
- Test on multiple devices

### 2. Alert Management

#### Alert Fatigue Prevention
- Set appropriate thresholds
- Use alert grouping
- Implement alert cooldown periods
- Regular threshold review

#### Incident Response
- Define escalation procedures
- Create runbooks for common issues
- Track alert effectiveness
- Regular team training

### 3. Performance Optimization

#### Check Frequency
- Balance monitoring coverage with cost
- Use different frequencies for different criticality
- Adjust based on historical data
- Consider business hours vs. off-hours

#### Resource Management
- Monitor check execution time
- Optimize test scripts
- Use appropriate check locations
- Regular performance review

## Integration with Other Tools

### 1. Sentry Integration

```typescript
// Send Checkly results to Sentry
const sendToSentry = async (checkResult: any) => {
  if (checkResult.hasFailures) {
    Sentry.captureMessage(
      `Checkly check failed: ${checkResult.name}`,
      'error',
      {
        tags: {
          checkly: true,
          check_name: checkResult.name,
          check_type: checkResult.type,
        },
        extra: {
          check_result: checkResult,
          failure_reason: checkResult.failureReason,
        },
      }
    );
  }
};
```

### 2. Better Stack Integration

```typescript
// Send Checkly results to Better Stack
const sendToBetterStack = async (checkResult: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: checkResult.hasFailures ? 'error' : 'info',
    category: 'monitoring',
    message: `Checkly check ${checkResult.hasFailures ? 'failed' : 'passed'}: ${checkResult.name}`,
    properties: {
      check_name: checkResult.name,
      check_type: checkResult.type,
      response_time: checkResult.responseTime,
      status_code: checkResult.statusCode,
      failure_reason: checkResult.failureReason,
    },
    app: 'yeko-admin',
    environment: process.env.NODE_ENV,
  };
  
  // Send to Better Stack
  await sendToBetterStack(logEntry);
};
```

## Maintenance and Updates

### 1. Regular Reviews

#### Monthly Reviews
- Review check performance
- Update thresholds based on trends
- Remove obsolete checks
- Add new critical endpoints

#### Quarterly Reviews
- Comprehensive monitoring strategy review
- Cost optimization analysis
- Tool evaluation and updates
- Team training updates

### 2. Documentation Updates

#### Keep Documentation Current
- Update check descriptions
- Maintain runbooks
- Document new procedures
- Update contact information

#### Knowledge Sharing
- Regular team training
- Incident post-mortems
- Best practice sharing
- Tool updates and changes

## Troubleshooting

### Common Issues

#### Check Failures
- Verify endpoint availability
- Check authentication tokens
- Review response format changes
- Validate test data

#### False Positives
- Adjust alert thresholds
- Review check logic
- Update test data
- Consider environmental factors

#### Performance Issues
- Optimize check scripts
- Reduce check frequency
- Use appropriate locations
- Monitor resource usage

### Support Resources
- Checkly Documentation: https://www.checklyhq.com/docs/
- API Reference: https://www.checklyhq.com/docs/api/
- Best Practices: https://www.checklyhq.com/docs/best-practices/
- Community Forum: https://github.com/checkly/checkly/discussions
