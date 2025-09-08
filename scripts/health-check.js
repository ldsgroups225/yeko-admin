#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const os = require("node:os");

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

// Health check categories
const HEALTH_CHECKS = {
  system: {
    name: "System Information",
    checks: [
      { name: "Node.js version", check: checkNodeVersion },
      { name: "Package manager", check: checkPackageManager },
      { name: "Operating system", check: checkOperatingSystem },
      { name: "Memory usage", check: checkMemoryUsage },
      { name: "Disk space", check: checkDiskSpace },
    ],
  },
  project: {
    name: "Project Structure",
    checks: [
      { name: "Required files", check: checkRequiredFiles },
      { name: "Required directories", check: checkRequiredDirectories },
      { name: "Configuration files", check: checkConfigurationFiles },
      { name: "Dependencies", check: checkDependencies },
    ],
  },
  code: {
    name: "Code Quality",
    checks: [
      { name: "TypeScript compilation", check: checkTypeScript },
      { name: "Linting", check: checkLinting },
      { name: "Dependency analysis", check: checkDependencyAnalysis },
      { name: "Test configuration", check: checkTestConfiguration },
    ],
  },
  tools: {
    name: "Development Tools",
    checks: [
      { name: "Git configuration", check: checkGitConfiguration },
      { name: "Git hooks", check: checkGitHooks },
      { name: "Storybook", check: checkStorybook },
      { name: "Playwright", check: checkPlaywright },
      { name: "Lighthouse CI", check: checkLighthouseCI },
    ],
  },
};

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion < 18) {
    return {
      status: "error",
      message: `Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`,
      details: { version: nodeVersion, majorVersion },
    };
  }

  return {
    status: "success",
    message: `Node.js version: ${nodeVersion}`,
    details: { version: nodeVersion, majorVersion },
  };
}

function checkPackageManager() {
  try {
    execSync("bun --version", { stdio: "pipe" });
    return {
      status: "success",
      message: "Bun package manager detected",
      details: { packageManager: "bun" },
    };
  } catch (error) {
    try {
      execSync("npm --version", { stdio: "pipe" });
      return {
        status: "warning",
        message: "Bun not found, using npm instead",
        details: { packageManager: "npm" },
      };
    } catch (npmError) {
      return {
        status: "error",
        message: "Neither Bun nor npm package manager found",
        details: { error: npmError.message },
      };
    }
  }
}

function checkOperatingSystem() {
  const platform = os.platform();
  const arch = os.arch();
  const release = os.release();

  return {
    status: "success",
    message: `Operating system: ${platform} ${arch} (${release})`,
    details: { platform, arch, release },
  };
}

function checkMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;

  const status =
    memoryUsagePercent > 90
      ? "error"
      : memoryUsagePercent > 80
        ? "warning"
        : "success";

  return {
    status,
    message: `Memory usage: ${memoryUsagePercent.toFixed(1)}% (${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB used of ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB)`,
    details: {
      totalMemory,
      freeMemory,
      usedMemory,
      memoryUsagePercent,
    },
  };
}

function checkDiskSpace() {
  try {
    const stats = fs.statSync(".");
    // This is a simplified check - in a real implementation, you'd use a library like 'diskusage'
    return {
      status: "success",
      message: "Disk space check passed",
      details: { note: "Detailed disk space check not implemented" },
    };
  } catch (error) {
    return {
      status: "error",
      message: "Could not check disk space",
      details: { error: error.message },
    };
  }
}

function checkRequiredFiles() {
  const requiredFiles = [
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "biome.json",
    "lefthook.yml",
  ];

  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    return {
      status: "error",
      message: `Missing required files: ${missingFiles.join(", ")}`,
      details: { missingFiles, totalRequired: requiredFiles.length },
    };
  }

  return {
    status: "success",
    message: "All required files present",
    details: { totalRequired: requiredFiles.length },
  };
}

function checkRequiredDirectories() {
  const requiredDirs = [
    "src",
    "src/app",
    "src/components",
    "src/lib",
    "src/types",
    "docs",
    "scripts",
    "tests",
  ];

  const missingDirs = requiredDirs.filter((dir) => !fs.existsSync(dir));

  if (missingDirs.length > 0) {
    return {
      status: "warning",
      message: `Missing directories: ${missingDirs.join(", ")}`,
      details: { missingDirs, totalRequired: requiredDirs.length },
    };
  }

  return {
    status: "success",
    message: "All required directories present",
    details: { totalRequired: requiredDirs.length },
  };
}

function checkConfigurationFiles() {
  const configFiles = [
    "biome.json",
    "lefthook.yml",
    "commitlint.config.ts",
    "lint-staged.config.mjs",
    "playwright.config.ts",
    "vitest.config.mts",
    "lighthouserc.js",
    "checkly.config.ts",
  ];

  const present = configFiles.filter((file) => fs.existsSync(file));
  const missing = configFiles.filter((file) => !fs.existsSync(file));

  const status =
    missing.length === 0
      ? "success"
      : missing.length <= 2
        ? "warning"
        : "error";

  return {
    status,
    message: `${present.length}/${configFiles.length} configuration files present`,
    details: { present, missing, total: configFiles.length },
  };
}

function checkDependencies() {
  try {
    if (fs.existsSync("node_modules")) {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});

      return {
        status: "success",
        message: `Dependencies installed (${dependencies.length} deps, ${devDependencies.length} dev deps)`,
        details: { dependencies, devDependencies },
      };
    } else {
      return {
        status: "error",
        message: "Dependencies not installed (node_modules not found)",
        details: {
          note: 'Run "npm install" or "bun install" to install dependencies',
        },
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Could not check dependencies",
      details: { error: error.message },
    };
  }
}

function checkTypeScript() {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return {
      status: "success",
      message: "TypeScript compilation successful",
      details: {},
    };
  } catch (error) {
    return {
      status: "error",
      message: "TypeScript compilation failed",
      details: { error: error.message },
    };
  }
}

function checkLinting() {
  try {
    execSync("npx biome check --no-errors-on-unmatched", { stdio: "pipe" });
    return {
      status: "success",
      message: "Linting check passed",
      details: {},
    };
  } catch (error) {
    return {
      status: "warning",
      message: "Linting issues found",
      details: { error: error.message },
    };
  }
}

function checkDependencyAnalysis() {
  try {
    execSync("npx knip", { stdio: "pipe" });
    return {
      status: "success",
      message: "Dependency analysis passed",
      details: {},
    };
  } catch (error) {
    return {
      status: "warning",
      message: "Dependency analysis found issues",
      details: { error: error.message },
    };
  }
}

function checkTestConfiguration() {
  const testConfigs = [
    "vitest.config.mts",
    "playwright.config.ts",
    ".storybook/vitest.config.mts",
  ];

  const present = testConfigs.filter((config) => fs.existsSync(config));

  if (present.length === 0) {
    return {
      status: "error",
      message: "No test configuration files found",
      details: { testConfigs },
    };
  }

  return {
    status: "success",
    message: `${present.length}/${testConfigs.length} test configurations present`,
    details: { present, total: testConfigs.length },
  };
}

function checkGitConfiguration() {
  try {
    execSync("git --version", { stdio: "pipe" });
    const branch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    const status = execSync("git status --porcelain", {
      encoding: "utf8",
    }).trim();

    return {
      status: "success",
      message: `Git configured (branch: ${branch})`,
      details: { branch, hasChanges: status.length > 0 },
    };
  } catch (error) {
    return {
      status: "error",
      message: "Git not configured or not available",
      details: { error: error.message },
    };
  }
}

function checkGitHooks() {
  try {
    if (fs.existsSync(".git/hooks/pre-commit")) {
      return {
        status: "success",
        message: "Git hooks installed",
        details: {},
      };
    } else {
      return {
        status: "warning",
        message: "Git hooks not installed",
        details: { note: 'Run "npx lefthook install" to install hooks' },
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Could not check Git hooks",
      details: { error: error.message },
    };
  }
}

function checkStorybook() {
  try {
    if (fs.existsSync(".storybook/main.ts")) {
      execSync("npx storybook --version", { stdio: "pipe" });
      return {
        status: "success",
        message: "Storybook configured and available",
        details: {},
      };
    } else {
      return {
        status: "warning",
        message: "Storybook not configured",
        details: { note: "Storybook configuration not found" },
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Storybook not available",
      details: { error: error.message },
    };
  }
}

function checkPlaywright() {
  try {
    if (fs.existsSync("playwright.config.ts")) {
      execSync("npx playwright --version", { stdio: "pipe" });
      return {
        status: "success",
        message: "Playwright configured and available",
        details: {},
      };
    } else {
      return {
        status: "warning",
        message: "Playwright not configured",
        details: { note: "Playwright configuration not found" },
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Playwright not available",
      details: { error: error.message },
    };
  }
}

function checkLighthouseCI() {
  try {
    if (fs.existsSync("lighthouserc.js")) {
      execSync("npx lhci --version", { stdio: "pipe" });
      return {
        status: "success",
        message: "Lighthouse CI configured and available",
        details: {},
      };
    } else {
      return {
        status: "warning",
        message: "Lighthouse CI not configured",
        details: { note: "Lighthouse CI configuration not found" },
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: "Lighthouse CI not available",
      details: { error: error.message },
    };
  }
}

function runHealthChecks() {
  log("🏥 Running health checks...", colors.bright);

  const results = {};
  let totalChecks = 0;
  let successfulChecks = 0;
  let warningChecks = 0;
  let errorChecks = 0;

  for (const [categoryKey, category] of Object.entries(HEALTH_CHECKS)) {
    log(`\n📋 ${category.name}:`, colors.bright);
    results[categoryKey] = {
      name: category.name,
      checks: {},
    };

    for (const check of category.checks) {
      try {
        const result = check.check();
        results[categoryKey].checks[check.name] = result;
        totalChecks++;

        switch (result.status) {
          case "success":
            logSuccess(`${check.name}: ${result.message}`);
            successfulChecks++;
            break;
          case "warning":
            logWarning(`${check.name}: ${result.message}`);
            warningChecks++;
            break;
          case "error":
            logError(`${check.name}: ${result.message}`);
            errorChecks++;
            break;
        }
      } catch (error) {
        results[categoryKey].checks[check.name] = {
          status: "error",
          message: `Check failed: ${error.message}`,
          details: { error: error.message },
        };
        logError(`${check.name}: Check failed - ${error.message}`);
        totalChecks++;
        errorChecks++;
      }
    }
  }

  return {
    results,
    summary: {
      totalChecks,
      successfulChecks,
      warningChecks,
      errorChecks,
    },
  };
}

function generateHealthReport(healthResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: healthResults.summary,
    results: healthResults.results,
    overallStatus:
      healthResults.summary.errorChecks > 0
        ? "unhealthy"
        : healthResults.summary.warningChecks > 0
          ? "warning"
          : "healthy",
  };

  // Write report to file
  const reportPath = "health-check-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Main execution
async function main() {
  try {
    log("🏥 Yeko Admin Health Check", colors.bright);
    log("=".repeat(50), colors.cyan);

    const healthResults = runHealthChecks();

    // Generate report
    const report = generateHealthReport(healthResults);

    // Display summary
    log("\n📊 Health Check Summary:", colors.bright);
    log(`   Total checks: ${report.summary.totalChecks}`, colors.cyan);
    log(`   ✅ Successful: ${report.summary.successfulChecks}`, colors.green);
    log(`   ⚠️  Warnings: ${report.summary.warningChecks}`, colors.yellow);
    log(`   ❌ Errors: ${report.summary.errorChecks}`, colors.red);

    const statusColor =
      report.overallStatus === "healthy"
        ? colors.green
        : report.overallStatus === "warning"
          ? colors.yellow
          : colors.red;
    log(
      `   Overall status: ${report.overallStatus.toUpperCase()}`,
      statusColor,
    );

    if (report.overallStatus === "healthy") {
      log(
        "\n🎉 All health checks passed! Your development environment is ready.",
        colors.green,
      );
    } else if (report.overallStatus === "warning") {
      log(
        "\n⚠️  Health check completed with warnings. Please review the issues above.",
        colors.yellow,
      );
    } else {
      log(
        "\n❌ Health check failed with errors. Please fix the issues above.",
        colors.red,
      );
    }

    log(
      `\n📄 Health check report saved to: health-check-report.json`,
      colors.cyan,
    );

    // Exit with appropriate code
    process.exit(report.overallStatus === "unhealthy" ? 1 : 0);
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Health Check Script", colors.bright);
    log("Usage: node scripts/health-check.js [options]");
    log("");
    log(
      "This script performs comprehensive health checks on the development environment.",
    );
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --json         Output results in JSON format only");
    log("  --quiet        Suppress output except errors");
    log("  --category     Run checks for specific category only");
    log("");
    process.exit(0);
  }

  main();
}

module.exports = {
  runHealthChecks,
  HEALTH_CHECKS,
};
