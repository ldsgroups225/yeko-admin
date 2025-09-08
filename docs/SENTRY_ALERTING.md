# Sentry Alerting Rules Configuration

This document provides comprehensive guidance for setting up and configuring Sentry alerting rules for critical error monitoring and performance tracking.

## Overview

Sentry provides powerful alerting capabilities for error tracking, performance monitoring, and release management. This guide covers alert rule setup, notification channels, and monitoring best practices.

## Alert Rules Configuration

### 1. Critical Error Alerts

#### Application Crashes
```json
{
  "name": "Application Crashes",
  "description": "Alert when the application crashes or encounters fatal errors",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "1m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "level",
      "value": "fatal"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-critical"
    },
    {
      "id": "sentry.rules.actions.notify_event_service.NotifyEventServiceAction",
      "service": "pagerduty"
    }
  ],
  "frequency": 1,
  "environment": "production"
}
```

#### Database Connection Errors
```json
{
  "name": "Database Connection Errors",
  "description": "Alert when database connection issues occur",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 3,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "category",
      "value": "database"
    },
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "1m"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-database"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

#### Authentication Failures
```json
{
  "name": "High Authentication Failure Rate",
  "description": "Alert when authentication failures exceed threshold",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 10,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "category",
      "value": "auth"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-security"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

### 2. Performance Monitoring Alerts

#### Slow API Responses
```json
{
  "name": "Slow API Response Times",
  "description": "Alert when API response times exceed threshold",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 5,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "category",
      "value": "api"
    },
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "1m"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-performance"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

#### High Memory Usage
```json
{
  "name": "High Memory Usage",
  "description": "Alert when memory usage exceeds threshold",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "1m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "metric",
      "value": "memory"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-infrastructure"
    }
  ],
  "frequency": 1,
  "environment": "production"
}
```

### 3. Release and Deployment Alerts

#### New Release Deployments
```json
{
  "name": "New Release Deployed",
  "description": "Notify team when a new release is deployed",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "1m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "category",
      "value": "release"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#deployments"
    }
  ],
  "frequency": 1,
  "environment": "production"
}
```

#### Release Health Degradation
```json
{
  "name": "Release Health Degradation",
  "description": "Alert when release health metrics degrade",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 1,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "category",
      "value": "release_health"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-releases"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

## Notification Channels Setup

### 1. Slack Integration

#### Critical Alerts Channel
```json
{
  "name": "Critical Alerts",
  "type": "slack",
  "config": {
    "channel": "#alerts-critical",
    "workspace": "yeko-admin",
    "tags": ["critical", "fatal", "crash"]
  }
}
```

#### Security Alerts Channel
```json
{
  "name": "Security Alerts",
  "type": "slack",
  "config": {
    "channel": "#alerts-security",
    "workspace": "yeko-admin",
    "tags": ["auth", "security", "unauthorized"]
  }
}
```

#### Performance Alerts Channel
```json
{
  "name": "Performance Alerts",
  "type": "slack",
  "config": {
    "channel": "#alerts-performance",
    "workspace": "yeko-admin",
    "tags": ["performance", "slow", "timeout"]
  }
}
```

### 2. Email Notifications

#### Critical Issues Email
```json
{
  "name": "Critical Issues Email",
  "type": "email",
  "config": {
    "recipients": ["devops@yeko.com", "engineering@yeko.com"],
    "subject": "🚨 Critical Issue Alert - Yeko Admin",
    "template": "critical_alert"
  }
}
```

#### Daily Summary Email
```json
{
  "name": "Daily Summary Email",
  "type": "email",
  "config": {
    "recipients": ["team@yeko.com"],
    "subject": "📊 Daily Error Summary - Yeko Admin",
    "template": "daily_summary",
    "schedule": "daily"
  }
}
```

### 3. PagerDuty Integration

#### Critical Issues PagerDuty
```json
{
  "name": "Critical Issues PagerDuty",
  "type": "pagerduty",
  "config": {
    "service_key": "YOUR_PAGERDUTY_SERVICE_KEY",
    "severity": "critical",
    "tags": ["critical", "fatal", "crash"]
  }
}
```

## Advanced Alerting Rules

### 1. Spike Detection

#### Error Rate Spike
```json
{
  "name": "Error Rate Spike Detection",
  "description": "Detect sudden spikes in error rates",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 20,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 5,
      "interval": "1m"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-spikes"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

### 2. User Impact Alerts

#### High User Impact Errors
```json
{
  "name": "High User Impact Errors",
  "description": "Alert when errors affect many users",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 10,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "user_count",
      "value": ">10"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-user-impact"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

### 3. Geographic Alerts

#### Region-Specific Issues
```json
{
  "name": "Region-Specific Issues",
  "description": "Alert when issues occur in specific regions",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 5,
      "interval": "5m"
    },
    {
      "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
      "key": "region",
      "value": "us-east-1"
    }
  ],
  "actions": [
    {
      "id": "sentry.rules.actions.notify_event.NotifyEventAction",
      "channel": "#alerts-regional"
    }
  ],
  "frequency": 5,
  "environment": "production"
}
```

## Integration with Application

### 1. Enhanced Error Context

Update Sentry configuration to include more context for better alerting:

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Enhanced error context for better alerting
  beforeSend(event, hint) {
    // Add user impact metrics
    event.tags = {
      ...event.tags,
      user_count: getAffectedUserCount(event),
      region: getCurrentRegion(),
      feature: getFeatureFromError(event),
      severity: calculateSeverity(event),
    };

    // Add business context
    event.contexts = {
      ...event.contexts,
      business: {
        feature: getFeatureFromError(event),
        user_type: getUserType(),
        subscription_tier: getSubscriptionTier(),
      }
    };

    return event;
  },

  // Enhanced breadcrumbs for better debugging
  beforeBreadcrumb(breadcrumb, hint) {
    // Add performance metrics to breadcrumbs
    if (breadcrumb.category === 'performance') {
      breadcrumb.data = {
        ...breadcrumb.data,
        memory_usage: getMemoryUsage(),
        cpu_usage: getCPUUsage(),
      };
    }

    return breadcrumb;
  },
});
```

### 2. Custom Error Boundaries with Alerting

```typescript
// components/ErrorBoundary.tsx
import * as Sentry from "@sentry/nextjs";

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Send to Sentry with enhanced context
    Sentry.captureException(error, {
      tags: {
        component: this.props.componentName,
        boundary: 'ErrorBoundary',
        severity: 'high',
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      extra: {
        errorBoundary: this.props.componentName,
        errorInfo,
      },
    });

    // Trigger immediate alert for critical components
    if (this.props.critical) {
      Sentry.captureMessage(
        `Critical component ${this.props.componentName} crashed`,
        'error'
      );
    }
  }
}
```

### 3. Performance Monitoring Integration

```typescript
// hooks/usePerformanceMonitoring.ts
import * as Sentry from "@sentry/nextjs";

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Alert on slow page loads
          if (navEntry.loadEventEnd - navEntry.loadEventStart > 3000) {
            Sentry.captureMessage('Slow page load detected', 'warning', {
              tags: {
                category: 'performance',
                metric: 'page_load',
                severity: 'medium',
              },
              extra: {
                load_time: navEntry.loadEventEnd - navEntry.loadEventStart,
                page: window.location.pathname,
              },
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, []);
}
```

## Monitoring Best Practices

### 1. Alert Fatigue Prevention

#### Threshold Tuning
- Start with conservative thresholds
- Gradually adjust based on historical data
- Use different thresholds for different environments
- Implement alert cooldown periods

#### Alert Grouping
- Group related alerts to reduce noise
- Use alert suppression for known issues
- Implement alert escalation policies
- Create alert runbooks for common issues

### 2. Alert Response Procedures

#### Critical Alerts (Immediate Response)
1. Acknowledge the alert within 5 minutes
2. Assess the impact and severity
3. Implement immediate mitigation if possible
4. Escalate to on-call engineer if needed
5. Document the incident and resolution

#### High Priority Alerts (Response within 30 minutes)
1. Investigate the root cause
2. Implement fixes or workarounds
3. Monitor for resolution
4. Update alert thresholds if needed

#### Medium/Low Priority Alerts (Response within 4 hours)
1. Review during regular maintenance windows
2. Analyze trends and patterns
3. Plan improvements and optimizations

### 3. Alert Maintenance

#### Regular Reviews
- Weekly alert effectiveness review
- Monthly threshold adjustment
- Quarterly alert rule cleanup
- Annual alert strategy review

#### Documentation
- Maintain alert runbooks
- Document alert response procedures
- Keep alert contact information updated
- Record lessons learned from incidents

## Troubleshooting

### Common Issues

#### Too Many Alerts
- Increase alert thresholds
- Implement alert grouping
- Use alert suppression rules
- Review and remove unnecessary alerts

#### Missing Alerts
- Check alert rule conditions
- Verify notification channel configuration
- Review Sentry project settings
- Test alert delivery

#### False Positives
- Adjust alert thresholds
- Add additional conditions
- Implement alert cooldown periods
- Review error filtering rules

### Support Resources
- Sentry Documentation: https://docs.sentry.io/
- Alert Rules Guide: https://docs.sentry.io/product/alerts/
- Notification Channels: https://docs.sentry.io/product/notifications/
- Performance Monitoring: https://docs.sentry.io/product/performance/
