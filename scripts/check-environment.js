#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
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

// Environment variables to check
const ENV_VARS = {
  required: ["NEXT_PUBLIC_APP_URL", "NODE_ENV"],
  optional: [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "SENTRY_DSN",
    "SENTRY_ORG",
    "SENTRY_PROJECT",
    "BETTER_STACK_SOURCE_TOKEN",
    "CHECKLY_PROJECT_NAME",
    "CHECKLY_LOGICAL_ID",
    "CHECKLY_EMAIL_ADDRESS",
    "GITHUB_REPOSITORY_URL",
    "VERCEL_BYPASS_TOKEN",
  ],
};

function checkEnvironmentVariables() {
  log("🔍 Checking environment variables...", colors.bright);

  const results = {
    required: {},
    optional: {},
    missing: [],
    invalid: [],
  };

  // Check required variables
  for (const varName of ENV_VARS.required) {
    const value = process.env[varName];
    if (!value) {
      results.missing.push(varName);
      results.required[varName] = { status: "missing", value: null };
    } else {
      results.required[varName] = { status: "present", value: value };
    }
  }

  // Check optional variables
  for (const varName of ENV_VARS.optional) {
    const value = process.env[varName];
    results.optional[varName] = {
      status: value ? "present" : "missing",
      value: value || null,
    };
  }

  // Validate specific variables
  validateEnvironmentVariables(results);

  return results;
}

function validateEnvironmentVariables(results) {
  // Validate NEXT_PUBLIC_APP_URL
  if (results.required.NEXT_PUBLIC_APP_URL?.value) {
    try {
      new URL(results.required.NEXT_PUBLIC_APP_URL.value);
    } catch (error) {
      results.invalid.push("NEXT_PUBLIC_APP_URL");
      results.required.NEXT_PUBLIC_APP_URL.status = "invalid";
    }
  }

  // Validate NODE_ENV
  if (results.required.NODE_ENV?.value) {
    const validEnvs = ["development", "production", "test"];
    if (!validEnvs.includes(results.required.NODE_ENV.value)) {
      results.invalid.push("NODE_ENV");
      results.required.NODE_ENV.status = "invalid";
    }
  }

  // Validate NEXTAUTH_URL
  if (results.optional.NEXTAUTH_URL?.value) {
    try {
      new URL(results.optional.NEXTAUTH_URL.value);
    } catch (error) {
      results.invalid.push("NEXTAUTH_URL");
      results.optional.NEXTAUTH_URL.status = "invalid";
    }
  }
}

function checkEnvironmentFiles() {
  log("📁 Checking environment files...", colors.bright);

  const envFiles = [
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.example",
  ];

  const results = {};

  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      const content = fs.readFileSync(file, "utf8");
      const lines = content
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"));

      results[file] = {
        exists: true,
        size: stats.size,
        lines: lines.length,
        lastModified: stats.mtime,
      };
    } else {
      results[file] = {
        exists: false,
        size: 0,
        lines: 0,
        lastModified: null,
      };
    }
  }

  return results;
}

function checkNodeEnvironment() {
  log("🟢 Checking Node.js environment...", colors.bright);

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
  const platform = process.platform;
  const arch = process.arch;

  const results = {
    version: nodeVersion,
    majorVersion,
    platform,
    arch,
    supported: majorVersion >= 18,
  };

  return results;
}

function checkPackageManager() {
  log("📦 Checking package manager...", colors.bright);

  const results = {
    bun: false,
    npm: false,
    yarn: false,
    active: null,
  };

  try {
    execSync("bun --version", { stdio: "pipe" });
    results.bun = true;
    results.active = "bun";
  } catch (error) {
    // Bun not available
  }

  try {
    execSync("npm --version", { stdio: "pipe" });
    results.npm = true;
    if (!results.active) results.active = "npm";
  } catch (error) {
    // npm not available
  }

  try {
    execSync("yarn --version", { stdio: "pipe" });
    results.yarn = true;
    if (!results.active) results.active = "yarn";
  } catch (error) {
    // yarn not available
  }

  return results;
}

function checkDependencies() {
  log("📚 Checking dependencies...", colors.bright);

  const results = {
    installed: false,
    packageManager: null,
    lockFile: null,
    nodeModules: false,
  };

  // Check for lock files
  if (fs.existsSync("bun.lockb")) {
    results.lockFile = "bun.lockb";
    results.packageManager = "bun";
  } else if (fs.existsSync("package-lock.json")) {
    results.lockFile = "package-lock.json";
    results.packageManager = "npm";
  } else if (fs.existsSync("yarn.lock")) {
    results.lockFile = "yarn.lock";
    results.packageManager = "yarn";
  }

  // Check for node_modules
  if (fs.existsSync("node_modules")) {
    results.nodeModules = true;
    results.installed = true;
  }

  return results;
}

function generateEnvironmentReport(
  envResults,
  fileResults,
  nodeResults,
  packageResults,
  depResults,
) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      variables: envResults,
      files: fileResults,
      node: nodeResults,
      packageManager: packageResults,
      dependencies: depResults,
    },
    summary: {
      status:
        envResults.missing.length === 0 && envResults.invalid.length === 0
          ? "healthy"
          : "unhealthy",
      missingVars: envResults.missing.length,
      invalidVars: envResults.invalid.length,
      envFiles: Object.values(fileResults).filter((f) => f.exists).length,
    },
  };

  // Write report to file
  const reportPath = "environment-check-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Main execution
async function main() {
  try {
    log("🔍 Environment Check", colors.bright);
    log("=".repeat(40), colors.cyan);

    // Run all checks
    const envResults = checkEnvironmentVariables();
    const fileResults = checkEnvironmentFiles();
    const nodeResults = checkNodeEnvironment();
    const packageResults = checkPackageManager();
    const depResults = checkDependencies();

    // Display results
    log("\n📊 Environment Check Results:", colors.bright);

    // Environment variables
    log("\n🔧 Environment Variables:", colors.bright);
    for (const [varName, result] of Object.entries(envResults.required)) {
      if (result.status === "present") {
        logSuccess(`${varName}: ${result.value}`);
      } else if (result.status === "invalid") {
        logError(`${varName}: Invalid value - ${result.value}`);
      } else {
        logError(`${varName}: Missing`);
      }
    }

    for (const [varName, result] of Object.entries(envResults.optional)) {
      if (result.status === "present") {
        logInfo(`${varName}: ${result.value}`);
      } else {
        logWarning(`${varName}: Not set (optional)`);
      }
    }

    // Environment files
    log("\n📁 Environment Files:", colors.bright);
    for (const [fileName, result] of Object.entries(fileResults)) {
      if (result.exists) {
        logSuccess(
          `${fileName}: ${result.lines} variables, ${result.size} bytes`,
        );
      } else {
        logWarning(`${fileName}: Not found`);
      }
    }

    // Node.js environment
    log("\n🟢 Node.js Environment:", colors.bright);
    if (nodeResults.supported) {
      logSuccess(
        `Node.js ${nodeResults.version} (${nodeResults.platform} ${nodeResults.arch})`,
      );
    } else {
      logError(
        `Node.js ${nodeResults.version} is not supported (requires 18+)`,
      );
    }

    // Package manager
    log("\n📦 Package Manager:", colors.bright);
    if (packageResults.active) {
      logSuccess(`Active: ${packageResults.active}`);
    } else {
      logError("No package manager found");
    }

    // Dependencies
    log("\n📚 Dependencies:", colors.bright);
    if (depResults.installed) {
      logSuccess(`Dependencies installed (${depResults.packageManager})`);
    } else {
      logError("Dependencies not installed");
    }

    // Generate report
    const report = generateEnvironmentReport(
      envResults,
      fileResults,
      nodeResults,
      packageResults,
      depResults,
    );

    // Summary
    log("\n📊 Summary:", colors.bright);
    log(
      `   Status: ${report.summary.status.toUpperCase()}`,
      report.summary.status === "healthy" ? colors.green : colors.red,
    );
    log(
      `   Missing variables: ${report.summary.missingVars}`,
      report.summary.missingVars === 0 ? colors.green : colors.red,
    );
    log(
      `   Invalid variables: ${report.summary.invalidVars}`,
      report.summary.invalidVars === 0 ? colors.green : colors.red,
    );
    log(`   Environment files: ${report.summary.envFiles}`, colors.cyan);

    if (report.summary.status === "healthy") {
      log("\n✅ Environment check passed!", colors.green);
    } else {
      log(
        "\n❌ Environment check failed! Please fix the issues above.",
        colors.red,
      );
    }

    log(
      `\n📄 Environment check report saved to: environment-check-report.json`,
      colors.cyan,
    );

    // Exit with appropriate code
    process.exit(report.summary.status === "healthy" ? 0 : 1);
  } catch (error) {
    logError(`Environment check failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Environment Check Script", colors.bright);
    log("Usage: node scripts/check-environment.js [options]");
    log("");
    log("This script checks the development environment configuration.");
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --json         Output results in JSON format only");
    log("  --quiet        Suppress output except errors");
    log("");
    process.exit(0);
  }

  main();
}

module.exports = {
  checkEnvironment: main,
  ENV_VARS,
};
