#!/usr/bin/env node

const fs = require("node:fs");
const _path = require("node:path");
const { execSync } = require("node:child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Configuration
const CONFIG = {
  requiredFiles: [
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "biome.json",
    "lefthook.yml",
  ],
  requiredDirs: [
    "src",
    "src/app",
    "src/components",
    "src/lib",
    "src/types",
    "docs",
    "scripts",
    "tests",
  ],
  envFiles: [".env.local", ".env.example", ".env.development"],
  gitHooks: ["pre-commit", "commit-msg"],
};

// Environment setup steps
const SETUP_STEPS = [
  {
    name: "Check Node.js version",
    action: checkNodeVersion,
    required: true,
  },
  {
    name: "Check package manager",
    action: checkPackageManager,
    required: true,
  },
  {
    name: "Install dependencies",
    action: installDependencies,
    required: true,
  },
  {
    name: "Check required files",
    action: checkRequiredFiles,
    required: true,
  },
  {
    name: "Check required directories",
    action: checkRequiredDirectories,
    required: true,
  },
  {
    name: "Setup environment files",
    action: setupEnvironmentFiles,
    required: false,
  },
  {
    name: "Setup Git hooks",
    action: setupGitHooks,
    required: true,
  },
  {
    name: "Validate TypeScript configuration",
    action: validateTypeScriptConfig,
    required: true,
  },
  {
    name: "Validate linting configuration",
    action: validateLintingConfig,
    required: true,
  },
  {
    name: "Generate metadata",
    action: generateMetadata,
    required: false,
  },
  {
    name: "Run initial checks",
    action: runInitialChecks,
    required: true,
  },
];

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);

  if (majorVersion < 18) {
    throw new Error(
      `Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`,
    );
  }

  logSuccess(`Node.js version: ${nodeVersion}`);
  return { nodeVersion, majorVersion };
}

function checkPackageManager() {
  try {
    // Check if bun is available
    execSync("bun --version", { stdio: "pipe" });
    logSuccess("Bun package manager detected");
    return { packageManager: "bun" };
  } catch (_error) {
    try {
      // Check if npm is available
      execSync("npm --version", { stdio: "pipe" });
      logWarning("Bun not found, using npm instead");
      return { packageManager: "npm" };
    } catch (_npmError) {
      throw new Error("Neither Bun nor npm package manager found");
    }
  }
}

function installDependencies() {
  try {
    logInfo("Installing dependencies...");
    execSync("bun install", { stdio: "inherit" });
    logSuccess("Dependencies installed successfully");
    return { installed: true };
  } catch (_error) {
    logWarning("Bun install failed, trying npm...");
    try {
      execSync("npm install", { stdio: "inherit" });
      logSuccess("Dependencies installed with npm");
      return { installed: true, usedNpm: true };
    } catch (_npmError) {
      throw new Error("Failed to install dependencies");
    }
  }
}

function checkRequiredFiles() {
  const missingFiles = [];

  for (const file of CONFIG.requiredFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
  }

  logSuccess("All required files present");
  return { missingFiles: [] };
}

function checkRequiredDirectories() {
  const missingDirs = [];

  for (const dir of CONFIG.requiredDirs) {
    if (!fs.existsSync(dir)) {
      missingDirs.push(dir);
    }
  }

  if (missingDirs.length > 0) {
    logWarning(`Missing directories: ${missingDirs.join(", ")}`);
    // Create missing directories
    for (const dir of missingDirs) {
      fs.mkdirSync(dir, { recursive: true });
      logInfo(`Created directory: ${dir}`);
    }
  }

  logSuccess("All required directories present");
  return { missingDirs, created: missingDirs };
}

function setupEnvironmentFiles() {
  const envFiles = [];

  // Check if .env.example exists
  if (!fs.existsSync(".env.example")) {
    const envExample = `# Environment variables for Yeko Admin
# Copy this file to .env.local and update the values

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=your_database_url_here

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Sentry
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# Better Stack
BETTER_STACK_SOURCE_TOKEN=your_better_stack_token_here

# Checkly
CHECKLY_PROJECT_NAME=yeko-admin
CHECKLY_LOGICAL_ID=yeko-admin-monitoring
CHECKLY_EMAIL_ADDRESS=your_email@example.com

# GitHub
GITHUB_REPOSITORY_URL=https://github.com/yeko/yeko-admin

# Vercel
VERCEL_BYPASS_TOKEN=your_vercel_bypass_token_here
`;

    fs.writeFileSync(".env.example", envExample);
    envFiles.push(".env.example");
    logInfo("Created .env.example file");
  }

  // Check if .env.local exists
  if (!fs.existsSync(".env.local")) {
    logWarning(
      ".env.local file not found. Please copy .env.example to .env.local and update the values.",
    );
  } else {
    logSuccess(".env.local file exists");
  }

  return { envFiles };
}

function setupGitHooks() {
  try {
    // Check if lefthook is installed
    execSync("npx lefthook --version", { stdio: "pipe" });

    // Install lefthook hooks
    execSync("npx lefthook install", { stdio: "inherit" });
    logSuccess("Git hooks installed successfully");
    return { hooksInstalled: true };
  } catch (_error) {
    logWarning(
      "Could not install Git hooks. Make sure lefthook is configured properly.",
    );
    return { hooksInstalled: false };
  }
}

function validateTypeScriptConfig() {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    logSuccess("TypeScript configuration is valid");
    return { valid: true };
  } catch (error) {
    logWarning(
      'TypeScript configuration has issues. Run "npm run typecheck" for details.',
    );
    return { valid: false, error: error.message };
  }
}

function validateLintingConfig() {
  try {
    execSync("npx biome check --no-errors-on-unmatched", { stdio: "pipe" });
    logSuccess("Linting configuration is valid");
    return { valid: true };
  } catch (error) {
    logWarning(
      'Linting configuration has issues. Run "npm run lint" for details.',
    );
    return { valid: false, error: error.message };
  }
}

function generateMetadata() {
  try {
    execSync("node scripts/generate-metadata.js", { stdio: "pipe" });
    logSuccess("Metadata generated successfully");
    return { generated: true };
  } catch (error) {
    logWarning("Could not generate metadata. This is optional.");
    return { generated: false, error: error.message };
  }
}

function runInitialChecks() {
  const results = {};

  try {
    // Run type check
    execSync("npm run typecheck", { stdio: "pipe" });
    results.typecheck = { passed: true };
    logSuccess("TypeScript check passed");
  } catch (error) {
    results.typecheck = { passed: false, error: error.message };
    logWarning("TypeScript check failed");
  }

  try {
    // Run linting
    execSync("npm run lint", { stdio: "pipe" });
    results.lint = { passed: true };
    logSuccess("Linting check passed");
  } catch (error) {
    results.lint = { passed: false, error: error.message };
    logWarning("Linting check failed");
  }

  try {
    // Run dependency check
    execSync("npm run check:deps", { stdio: "pipe" });
    results.deps = { passed: true };
    logSuccess("Dependency check passed");
  } catch (error) {
    results.deps = { passed: false, error: error.message };
    logWarning("Dependency check failed");
  }

  return results;
}

function checkEnvironment() {
  log("🔍 Checking development environment...", colors.bright);

  const results = {};
  let hasErrors = false;

  for (const step of SETUP_STEPS) {
    try {
      logInfo(`Checking: ${step.name}`);
      const result = step.action();
      results[step.name] = { success: true, result };

      if (step.required && !result) {
        hasErrors = true;
      }
    } catch (error) {
      results[step.name] = { success: false, error: error.message };
      logError(`${step.name}: ${error.message}`);

      if (step.required) {
        hasErrors = true;
      }
    }
  }

  return { results, hasErrors };
}

function initializeEnvironment() {
  log("🚀 Initializing development environment...", colors.bright);

  const results = {};
  let hasErrors = false;

  for (const step of SETUP_STEPS) {
    try {
      logInfo(`Setting up: ${step.name}`);
      const result = step.action();
      results[step.name] = { success: true, result };
      logSuccess(`${step.name} completed`);
    } catch (error) {
      results[step.name] = { success: false, error: error.message };
      logError(`${step.name} failed: ${error.message}`);

      if (step.required) {
        hasErrors = true;
      }
    }
  }

  return { results, hasErrors };
}

function generateSetupReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSteps: Object.keys(results).length,
      successfulSteps: Object.values(results).filter((r) => r.success).length,
      failedSteps: Object.values(results).filter((r) => !r.success).length,
    },
    results,
  };

  // Write report to file
  const reportPath = "dev-environment-setup-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "init";

  try {
    let results;

    switch (command) {
      case "check":
        results = checkEnvironment();
        break;
      case "init":
        results = initializeEnvironment();
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }

    // Generate report
    const report = generateSetupReport(results.results);

    // Display summary
    log("\n📊 Setup Summary:", colors.bright);
    log(`   Total steps: ${report.summary.totalSteps}`, colors.cyan);
    log(`   Successful: ${report.summary.successfulSteps}`, colors.green);
    log(
      `   Failed: ${report.summary.failedSteps}`,
      report.summary.failedSteps === 0 ? colors.green : colors.red,
    );

    if (results.hasErrors) {
      log(
        "\n❌ Setup completed with errors. Please review the failed steps.",
        colors.red,
      );
      process.exit(1);
    } else {
      log(
        "\n✅ Development environment setup completed successfully!",
        colors.green,
      );
      log("\nNext steps:", colors.bright);
      log(
        "   1. Copy .env.example to .env.local and update the values",
        colors.cyan,
      );
      log(
        '   2. Run "npm run dev" to start the development server',
        colors.cyan,
      );
      log('   3. Run "npm run storybook" to start Storybook', colors.cyan);
      log('   4. Run "npm run test" to run tests', colors.cyan);
    }

    log(
      `\n📄 Setup report saved to: dev-environment-setup-report.json`,
      colors.cyan,
    );
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Development Environment Setup Script", colors.bright);
    log("Usage: node scripts/setup-dev-environment.js [command] [options]");
    log("");
    log("Commands:");
    log("  init (default)  Initialize the development environment");
    log("  check          Check the current environment status");
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --verbose, -v  Enable verbose output");
    log("");
    process.exit(0);
  }

  main();
}

module.exports = {
  setupDevEnvironment: main,
  checkEnvironment,
  initializeEnvironment,
  CONFIG,
  SETUP_STEPS,
};
