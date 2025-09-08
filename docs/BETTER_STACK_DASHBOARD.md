# Better Stack Dashboard Configuration

This document provides comprehensive guidance for setting up and configuring Better Stack dashboards for log analysis and monitoring.

## Overview

Better Stack provides powerful log analysis and monitoring capabilities for the Yeko Admin application. This guide covers dashboard setup, alerting rules, and monitoring best practices.

## Dashboard Setup

### 1. Initial Dashboard Configuration

#### Create Main Application Dashboard
```json
{
  "name": "Yeko Admin - Application Overview",
  "description": "Main dashboard for monitoring application health and performance",
  "widgets": [
    {
      "type": "time_series",
      "title": "Error Rate",
      "query": "level:error AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "count"
    },
    {
      "type": "time_series", 
      "title": "Response Time",
      "query": "category:api AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "avg",
      "field": "properties.duration"
    },
    {
      "type": "pie_chart",
      "title": "Error Categories",
      "query": "level:error AND app:yeko-admin",
      "time_range": "24h",
      "group_by": "category"
    }
  ]
}
```

#### Authentication Dashboard
```json
{
  "name": "Yeko Admin - Authentication",
  "description": "Monitor authentication events and security",
  "widgets": [
    {
      "type": "time_series",
      "title": "Login Attempts",
      "query": "category:auth AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "count"
    },
    {
      "type": "time_series",
      "title": "Failed Logins",
      "query": "category:auth AND level:error AND app:yeko-admin",
      "time_range": "1h", 
      "aggregation": "count"
    },
    {
      "type": "table",
      "title": "Recent Failed Logins",
      "query": "category:auth AND level:error AND app:yeko-admin",
      "time_range": "1h",
      "columns": ["timestamp", "properties.email", "properties.ip", "message"]
    }
  ]
}
```

#### API Performance Dashboard
```json
{
  "name": "Yeko Admin - API Performance",
  "description": "Monitor API endpoints and performance",
  "widgets": [
    {
      "type": "time_series",
      "title": "API Response Times",
      "query": "category:api AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "avg",
      "field": "properties.duration"
    },
    {
      "type": "time_series",
      "title": "API Error Rate",
      "query": "category:api AND level:error AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "count"
    },
    {
      "type": "table",
      "title": "Slowest Endpoints",
      "query": "category:api AND app:yeko-admin",
      "time_range": "1h",
      "aggregation": "avg",
      "field": "properties.duration",
      "group_by": "properties.endpoint",
      "order": "desc",
      "limit": 10
    }
  ]
}
```

### 2. Custom Queries and Filters

#### Error Analysis Queries
```bash
# Critical errors in the last hour
level:error AND app:yeko-admin AND timestamp:>now-1h

# Authentication failures
category:auth AND level:error AND app:yeko-admin

# API errors by endpoint
category:api AND level:error AND app:yeko-admin | group by properties.endpoint

# Database errors
category:database AND level:error AND app:yeko-admin

# UI performance issues
category:ui AND properties.metric:render AND properties.value:>500
```

#### Performance Monitoring Queries
```bash
# Average response times by endpoint
category:api AND app:yeko-admin | avg(properties.duration) by properties.endpoint

# Slow database queries
category:database AND properties.duration:>1000

# High memory usage
category:app AND properties.memory:>1000000000

# User activity patterns
category:auth AND message:"login successful" | count by hour
```

### 3. Alert Rules Configuration

#### Critical Error Alerts
```json
{
  "name": "Critical Application Errors",
  "description": "Alert when critical errors occur",
  "query": "level:error AND app:yeko-admin AND (category:app OR category:database)",
  "condition": "count > 10",
  "time_window": "5m",
  "notification_channels": ["email", "slack"],
  "severity": "critical"
}
```

#### Authentication Security Alerts
```json
{
  "name": "Authentication Anomalies",
  "description": "Alert on suspicious authentication activity",
  "query": "category:auth AND level:error AND app:yeko-admin",
  "condition": "count > 5",
  "time_window": "5m",
  "notification_channels": ["email", "slack"],
  "severity": "high"
}
```

#### Performance Degradation Alerts
```json
{
  "name": "API Performance Degradation",
  "description": "Alert when API response times are high",
  "query": "category:api AND app:yeko-admin",
  "condition": "avg(properties.duration) > 2000",
  "time_window": "5m",
  "notification_channels": ["email"],
  "severity": "medium"
}
```

## Monitoring Best Practices

### 1. Log Structure Standards

Ensure all logs follow the established structure:
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
    "userAgent": "Mozilla/5.0...",
    "duration": 150
  },
  "app": "yeko-admin",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Dashboard Organization

#### Dashboard Categories
- **Application Health**: Overall system status and errors
- **Authentication**: Login/logout events and security
- **API Performance**: Endpoint monitoring and response times
- **Database**: Query performance and errors
- **User Experience**: UI performance and user interactions
- **Infrastructure**: Server metrics and resource usage

#### Widget Types
- **Time Series**: For trends over time
- **Pie Charts**: For categorical data distribution
- **Tables**: For detailed event listings
- **Gauges**: For current status indicators
- **Heatmaps**: For pattern analysis

### 3. Alerting Strategy

#### Alert Severity Levels
- **Critical**: System down, data loss, security breach
- **High**: Performance degradation, authentication issues
- **Medium**: Warning conditions, slow responses
- **Low**: Informational alerts, maintenance notifications

#### Notification Channels
- **Email**: For all severity levels
- **Slack**: For critical and high severity
- **PagerDuty**: For critical alerts only
- **Webhook**: For integration with other systems

### 4. Query Optimization

#### Efficient Queries
```bash
# Use specific time ranges
timestamp:>now-1h

# Filter by app and environment
app:yeko-admin AND environment:production

# Use field-specific searches
properties.userId:123

# Combine filters effectively
level:error AND category:api AND properties.duration:>1000
```

#### Performance Tips
- Use specific time ranges to limit data
- Filter by app and environment early
- Use field-specific searches when possible
- Avoid overly broad queries
- Use aggregations for large datasets

## Integration with Application

### 1. Dashboard Embedding

Embed Better Stack dashboards in the admin interface:

```typescript
// components/MonitoringDashboard.tsx
import { useEffect, useState } from 'react';

export function MonitoringDashboard() {
  const [dashboardUrl, setDashboardUrl] = useState('');

  useEffect(() => {
    // Generate signed URL for Better Stack dashboard
    const url = generateDashboardUrl({
      dashboardId: 'yeko-admin-overview',
      timeRange: '1h',
      filters: {
        app: 'yeko-admin',
        environment: process.env.NODE_ENV
      }
    });
    setDashboardUrl(url);
  }, []);

  return (
    <div className="w-full h-96">
      <iframe
        src={dashboardUrl}
        className="w-full h-full border rounded"
        title="Application Monitoring Dashboard"
      />
    </div>
  );
}
```

### 2. Real-time Monitoring

Set up real-time log streaming for critical events:

```typescript
// hooks/useRealTimeMonitoring.ts
import { useEffect, useState } from 'react';

export function useRealTimeMonitoring() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/monitoring/stream');
    
    eventSource.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    };

    return () => eventSource.close();
  }, []);

  return alerts;
}
```

## Maintenance and Updates

### 1. Regular Dashboard Reviews
- Review dashboard performance monthly
- Update queries based on new log patterns
- Adjust alert thresholds based on historical data
- Archive old dashboards and create new ones as needed

### 2. Query Optimization
- Monitor query performance
- Optimize slow queries
- Update queries for new log formats
- Remove unused queries and dashboards

### 3. Alert Tuning
- Review alert effectiveness
- Adjust thresholds based on false positives
- Add new alerts for emerging issues
- Remove alerts that are no longer relevant

## Troubleshooting

### Common Issues

#### High Log Volume
- Implement log sampling for high-volume events
- Use more specific queries to reduce data
- Consider log retention policies

#### Slow Queries
- Add time range filters
- Use more specific field searches
- Consider query caching

#### Missing Logs
- Check log transport configuration
- Verify Better Stack token validity
- Review log filtering rules

### Support Resources
- Better Stack Documentation: https://betterstack.com/docs/
- Log Analysis Best Practices: https://betterstack.com/docs/logs/
- Alert Configuration Guide: https://betterstack.com/docs/alerts/
