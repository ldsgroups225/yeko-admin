#!/usr/bin/env node

/**
 * Monitoring Setup Script
 *
 * This script helps set up monitoring dashboards and alerting for the Yeko Admin application.
 * It provides configuration templates and setup instructions for Better Stack, Sentry, and Checkly.
 */

const fs = require("node:fs");
const path = require("node:path");

// Configuration templates
const betterStackConfig = {
  dashboards: [
    {
      name: "Yeko Admin - Application Overview",
      description:
        "Main dashboard for monitoring application health and performance",
      widgets: [
        {
          type: "time_series",
          title: "Error Rate",
          query: "level:error AND app:yeko-admin",
          time_range: "1h",
          aggregation: "count",
        },
        {
          type: "time_series",
          title: "Response Time",
          query: "category:api AND app:yeko-admin",
          time_range: "1h",
          aggregation: "avg",
          field: "properties.duration",
        },
        {
          type: "pie_chart",
          title: "Error Categories",
          query: "level:error AND app:yeko-admin",
          time_range: "24h",
          group_by: "category",
        },
      ],
    },
    {
      name: "Yeko Admin - Authentication",
      description: "Monitor authentication events and security",
      widgets: [
        {
          type: "time_series",
          title: "Login Attempts",
          query: "category:auth AND app:yeko-admin",
          time_range: "1h",
          aggregation: "count",
        },
        {
          type: "time_series",
          title: "Failed Logins",
          query: "category:auth AND level:error AND app:yeko-admin",
          time_range: "1h",
          aggregation: "count",
        },
        {
          type: "table",
          title: "Recent Failed Logins",
          query: "category:auth AND level:error AND app:yeko-admin",
          time_range: "1h",
          columns: [
            "timestamp",
            "properties.email",
            "properties.ip",
            "message",
          ],
        },
      ],
    },
  ],
  alerts: [
    {
      name: "Critical Application Errors",
      description: "Alert when critical errors occur",
      query:
        "level:error AND app:yeko-admin AND (category:app OR category:database)",
      condition: "count > 10",
      time_window: "5m",
      notification_channels: ["email", "slack"],
      severity: "critical",
    },
    {
      name: "Authentication Anomalies",
      description: "Alert on suspicious authentication activity",
      query: "category:auth AND level:error AND app:yeko-admin",
      condition: "count > 5",
      time_window: "5m",
      notification_channels: ["email", "slack"],
      severity: "high",
    },
  ],
};

const sentryConfig = {
  alertRules: [
    {
      name: "Application Crashes",
      description:
        "Alert when the application crashes or encounters fatal errors",
      conditions: [
        {
          id: "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
          value: 1,
          interval: "1m",
        },
        {
          id: "sentry.rules.conditions.tagged_event.TaggedEventCondition",
          key: "level",
          value: "fatal",
        },
      ],
      actions: [
        {
          id: "sentry.rules.actions.notify_event.NotifyEventAction",
          channel: "#alerts-critical",
        },
      ],
      frequency: 1,
      environment: "production",
    },
    {
      name: "High Authentication Failure Rate",
      description: "Alert when authentication failures exceed threshold",
      conditions: [
        {
          id: "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
          value: 10,
          interval: "5m",
        },
        {
          id: "sentry.rules.conditions.tagged_event.TaggedEventCondition",
          key: "category",
          value: "auth",
        },
      ],
      actions: [
        {
          id: "sentry.rules.actions.notify_event.NotifyEventAction",
          channel: "#alerts-security",
        },
      ],
      frequency: 5,
      environment: "production",
    },
  ],
  notificationChannels: [
    {
      name: "Critical Alerts",
      type: "slack",
      config: {
        channel: "#alerts-critical",
        workspace: "yeko-admin",
        tags: ["critical", "fatal", "crash"],
      },
    },
    {
      name: "Security Alerts",
      type: "slack",
      config: {
        channel: "#alerts-security",
        workspace: "yeko-admin",
        tags: ["auth", "security", "unauthorized"],
      },
    },
  ],
};

const checklyConfig = {
  apiChecks: [
    {
      name: "Health Check Endpoint",
      url: "/api/health",
      method: "GET",
      expectedStatus: 200,
      maxResponseTime: 1000,
      frequency: "1m",
      tags: ["health", "critical"],
    },
    {
      name: "Sign In Endpoint",
      url: "/api/auth/signin",
      method: "POST",
      expectedStatus: 401, // Expected to fail with invalid credentials
      maxResponseTime: 2000,
      frequency: "5m",
      tags: ["auth", "critical"],
    },
  ],
  browserChecks: [
    {
      name: "Homepage Accessibility",
      testFile: "tests/e2e/homepage.check.e2e.ts",
      frequency: "30m",
      tags: ["homepage", "accessibility"],
    },
    {
      name: "Authentication Flow",
      testFile: "tests/e2e/auth.check.e2e.ts",
      frequency: "1h",
      tags: ["auth", "critical"],
    },
  ],
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Monitoring Setup Script for Yeko Admin

Usage: node scripts/setup-monitoring.js <command>

Commands:
  help                    Show this help message
  better-stack           Generate Better Stack configuration
  sentry                 Generate Sentry configuration
  checkly                Generate Checkly configuration
  all                    Generate all configurations
  env                    Show required environment variables

Examples:
  node scripts/setup-monitoring.js better-stack
  node scripts/setup-monitoring.js all
  node scripts/setup-monitoring.js env
`);
}

function generateBetterStackConfig() {
  const configDir = path.join(__dirname, "..", "config", "monitoring");
  const betterStackDir = path.join(configDir, "better-stack");

  // Create directories
  fs.mkdirSync(betterStackDir, { recursive: true });

  // Generate dashboard configurations
  betterStackConfig.dashboards.forEach((dashboard, index) => {
    const filename = `dashboard-${index + 1}-${dashboard.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
    const filepath = path.join(betterStackDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(dashboard, null, 2));
  });

  // Generate alert configurations
  const alertsFile = path.join(betterStackDir, "alerts.json");
  fs.writeFileSync(
    alertsFile,
    JSON.stringify(betterStackConfig.alerts, null, 2),
  );

  // Generate setup instructions
  const instructions = `
# Better Stack Setup Instructions

## 1. Dashboard Setup

Import the following dashboard configurations:
${betterStackConfig.dashboards.map((d, i) => `- dashboard-${i + 1}-${d.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`).join("\n")}

## 2. Alert Rules Setup

Import the alert rules from alerts.json and configure:
- Email notifications
- Slack webhook integration
- Alert thresholds

## 3. Environment Variables

Add these to your .env.local:
BETTER_STACK_TOKEN=your_better_stack_token
BETTER_STACK_ENABLED=true
BETTER_STACK_BATCH_SIZE=10
BETTER_STACK_FLUSH_INTERVAL=5000

## 4. Dashboard Access

- Log in to Better Stack
- Navigate to Dashboards
- Import the generated configurations
- Customize widgets and queries as needed

## 5. Alert Configuration

- Set up notification channels
- Configure alert thresholds
- Test alert delivery
- Set up escalation policies
`;

  const instructionsFile = path.join(betterStackDir, "SETUP_INSTRUCTIONS.md");
  fs.writeFileSync(instructionsFile, instructions);

  console.log(`✅ Better Stack configuration generated in ${betterStackDir}`);
  console.log(`📁 Files created:`);
  console.log(
    `   - ${betterStackConfig.dashboards.length} dashboard configurations`,
  );
  console.log(`   - alerts.json`);
  console.log(`   - SETUP_INSTRUCTIONS.md`);
}

function generateSentryConfig() {
  const configDir = path.join(__dirname, "..", "config", "monitoring");
  const sentryDir = path.join(configDir, "sentry");

  // Create directories
  fs.mkdirSync(sentryDir, { recursive: true });

  // Generate alert rules
  const alertRulesFile = path.join(sentryDir, "alert-rules.json");
  fs.writeFileSync(
    alertRulesFile,
    JSON.stringify(sentryConfig.alertRules, null, 2),
  );

  // Generate notification channels
  const notificationChannelsFile = path.join(
    sentryDir,
    "notification-channels.json",
  );
  fs.writeFileSync(
    notificationChannelsFile,
    JSON.stringify(sentryConfig.notificationChannels, null, 2),
  );

  // Generate setup instructions
  const instructions = `
# Sentry Setup Instructions

## 1. Alert Rules Setup

Import the alert rules from alert-rules.json:
- Application Crashes
- High Authentication Failure Rate
- Database Connection Errors
- Performance Degradation

## 2. Notification Channels

Set up notification channels from notification-channels.json:
- Slack integration for critical alerts
- Email notifications for all alerts
- PagerDuty integration for critical issues

## 3. Environment Variables

Add these to your .env.local:
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token

## 4. Alert Configuration

- Configure alert thresholds
- Set up notification channels
- Test alert delivery
- Configure escalation policies

## 5. Performance Monitoring

- Set up performance monitoring
- Configure transaction sampling
- Set up release tracking
- Configure source map uploads
`;

  const instructionsFile = path.join(sentryDir, "SETUP_INSTRUCTIONS.md");
  fs.writeFileSync(instructionsFile, instructions);

  console.log(`✅ Sentry configuration generated in ${sentryDir}`);
  console.log(`📁 Files created:`);
  console.log(`   - alert-rules.json`);
  console.log(`   - notification-channels.json`);
  console.log(`   - SETUP_INSTRUCTIONS.md`);
}

function generateChecklyConfig() {
  const configDir = path.join(__dirname, "..", "config", "monitoring");
  const checklyDir = path.join(configDir, "checkly");

  // Create directories
  fs.mkdirSync(checklyDir, { recursive: true });

  // Generate API checks configuration
  const apiChecksFile = path.join(checklyDir, "api-checks.json");
  fs.writeFileSync(
    apiChecksFile,
    JSON.stringify(checklyConfig.apiChecks, null, 2),
  );

  // Generate browser checks configuration
  const browserChecksFile = path.join(checklyDir, "browser-checks.json");
  fs.writeFileSync(
    browserChecksFile,
    JSON.stringify(checklyConfig.browserChecks, null, 2),
  );

  // Generate setup instructions
  const instructions = `
# Checkly Setup Instructions

## 1. API Checks Setup

Configure API checks from api-checks.json:
- Health Check Endpoint
- Sign In Endpoint
- Users API Endpoint
- Schools API Endpoint

## 2. Browser Checks Setup

Set up browser checks from browser-checks.json:
- Homepage Accessibility
- Authentication Flow
- Dashboard Functionality

## 3. Environment Variables

Add these to your .env.local:
CHECKLY_PROJECT_NAME=yeko-admin
CHECKLY_LOGICAL_ID=yeko-admin-monitoring
CHECKLY_EMAIL_ADDRESS=alerts@yeko.com
CHECKLY_SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
CHECKLY_WEBHOOK_URL=https://your-webhook-endpoint.com/checkly
CHECKLY_API_TOKEN=your_api_token_for_authenticated_checks
ENVIRONMENT_URL=https://yeko-admin.vercel.app
VERCEL_BYPASS_TOKEN=your_vercel_bypass_token

## 4. Test Files

Create the following test files:
- tests/e2e/homepage.check.e2e.ts
- tests/e2e/auth.check.e2e.ts
- tests/e2e/dashboard.check.e2e.ts

## 5. Deployment

- Deploy checks to Checkly
- Configure alert channels
- Set up monitoring schedules
- Test check execution
`;

  const instructionsFile = path.join(checklyDir, "SETUP_INSTRUCTIONS.md");
  fs.writeFileSync(instructionsFile, instructions);

  console.log(`✅ Checkly configuration generated in ${checklyDir}`);
  console.log(`📁 Files created:`);
  console.log(`   - api-checks.json`);
  console.log(`   - browser-checks.json`);
  console.log(`   - SETUP_INSTRUCTIONS.md`);
}

function showEnvironmentVariables() {
  console.log(`
Required Environment Variables for Monitoring Setup:

# Better Stack Configuration
BETTER_STACK_TOKEN=your_better_stack_token
BETTER_STACK_ENABLED=true
BETTER_STACK_BATCH_SIZE=10
BETTER_STACK_FLUSH_INTERVAL=5000

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token

# Checkly Configuration
CHECKLY_PROJECT_NAME=yeko-admin
CHECKLY_LOGICAL_ID=yeko-admin-monitoring
CHECKLY_EMAIL_ADDRESS=alerts@yeko.com
CHECKLY_SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
CHECKLY_WEBHOOK_URL=https://your-webhook-endpoint.com/checkly
CHECKLY_API_TOKEN=your_api_token_for_authenticated_checks
ENVIRONMENT_URL=https://yeko-admin.vercel.app
VERCEL_BYPASS_TOKEN=your_vercel_bypass_token

# Application URLs
NEXT_PUBLIC_APP_URL=https://yeko-admin.vercel.app
GITHUB_REPOSITORY_URL=https://github.com/yeko/yeko-admin

# Slack Integration (for all tools)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SLACK_CHANNEL_CRITICAL=#alerts-critical
SLACK_CHANNEL_SECURITY=#alerts-security
SLACK_CHANNEL_PERFORMANCE=#alerts-performance

# Email Configuration
ALERT_EMAIL_ADDRESS=alerts@yeko.com
TEAM_EMAIL_ADDRESS=team@yeko.com
DEVOPS_EMAIL_ADDRESS=devops@yeko.com
`);
}

function generateAllConfigs() {
  console.log("🚀 Generating all monitoring configurations...\n");

  generateBetterStackConfig();
  console.log("");

  generateSentryConfig();
  console.log("");

  generateChecklyConfig();
  console.log("");

  console.log("✅ All monitoring configurations generated successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Review the generated configurations in config/monitoring/");
  console.log("2. Set up the required environment variables");
  console.log("3. Follow the setup instructions for each tool");
  console.log("4. Test the monitoring setup");
  console.log("5. Configure alert channels and thresholds");
}

// Main execution
switch (command) {
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  case "better-stack":
    generateBetterStackConfig();
    break;
  case "sentry":
    generateSentryConfig();
    break;
  case "checkly":
    generateChecklyConfig();
    break;
  case "all":
    generateAllConfigs();
    break;
  case "env":
    showEnvironmentVariables();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
