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

// Post-install tasks
const POST_INSTALL_TASKS = [
  {
    name: "Setup Git hooks",
    action: setupGitHooks,
    required: false,
  },
  {
    name: "Generate metadata",
    action: generateMetadata,
    required: false,
  },
  {
    name: "Validate environment",
    action: validateEnvironment,
    required: false,
  },
  {
    name: "Create necessary directories",
    action: createDirectories,
    required: true,
  },
  {
    name: "Check configuration files",
    action: checkConfigurationFiles,
    required: true,
  },
];

function setupGitHooks() {
  try {
    // Check if lefthook is available
    execSync("npx lefthook --version", { stdio: "pipe" });

    // Install lefthook hooks
    execSync("npx lefthook install", { stdio: "pipe" });
    logSuccess("Git hooks installed");
    return { success: true };
  } catch (error) {
    logWarning("Could not install Git hooks (this is optional)");
    return { success: false, error: error.message };
  }
}

function generateMetadata() {
  try {
    // Check if metadata generation script exists
    if (fs.existsSync("scripts/generate-metadata.js")) {
      execSync("node scripts/generate-metadata.js", { stdio: "pipe" });
      logSuccess("Metadata generated");
      return { success: true };
    } else {
      logWarning("Metadata generation script not found");
      return { success: false, error: "Script not found" };
    }
  } catch (error) {
    logWarning("Could not generate metadata (this is optional)");
    return { success: false, error: error.message };
  }
}

function validateEnvironment() {
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);

    if (majorVersion < 18) {
      logWarning(
        `Node.js version ${nodeVersion} is not recommended. Please use Node.js 18 or higher.`,
      );
    } else {
      logSuccess(`Node.js version: ${nodeVersion}`);
    }

    // Check if required files exist
    const requiredFiles = ["package.json", "tsconfig.json", "next.config.ts"];
    const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

    if (missingFiles.length > 0) {
      logWarning(`Missing files: ${missingFiles.join(", ")}`);
    } else {
      logSuccess("Required configuration files present");
    }

    return {
      success: true,
      nodeVersion,
      missingFiles,
    };
  } catch (error) {
    logError(`Environment validation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function createDirectories() {
  const directories = [
    "src/lib/metadata",
    "src/lib/utils",
    "src/lib/validations",
    "src/hooks",
    "src/types",
    "src/constants",
    "src/services",
    "src/actions",
    "docs",
    "scripts",
    "tests/unit",
    "tests/integration",
    "tests/visual",
    ".lighthouseci",
    "coverage",
    "storybook-static",
  ];

  const created = [];
  const existing = [];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      created.push(dir);
    } else {
      existing.push(dir);
    }
  }

  if (created.length > 0) {
    logSuccess(`Created ${created.length} directories`);
  }

  if (existing.length > 0) {
    logInfo(`${existing.length} directories already exist`);
  }

  return { created, existing };
}

function checkConfigurationFiles() {
  const configFiles = [
    { file: "biome.json", description: "Biome configuration" },
    { file: "lefthook.yml", description: "Git hooks configuration" },
    {
      file: "commitlint.config.ts",
      description: "Commit linting configuration",
    },
    {
      file: "lint-staged.config.mjs",
      description: "Lint-staged configuration",
    },
    { file: "playwright.config.ts", description: "Playwright configuration" },
    { file: "vitest.config.mts", description: "Vitest configuration" },
    { file: "lighthouserc.js", description: "Lighthouse CI configuration" },
    { file: "checkly.config.ts", description: "Checkly configuration" },
  ];

  const present = [];
  const missing = [];

  for (const config of configFiles) {
    if (fs.existsSync(config.file)) {
      present.push(config);
    } else {
      missing.push(config);
    }
  }

  logSuccess(`${present.length} configuration files present`);

  if (missing.length > 0) {
    logWarning(
      `${missing.length} configuration files missing: ${missing.map((c) => c.file).join(", ")}`,
    );
  }

  return { present, missing };
}

function runPostInstallTasks() {
  log("🔧 Running post-install tasks...", colors.bright);

  const results = {};
  let hasErrors = false;

  for (const task of POST_INSTALL_TASKS) {
    try {
      logInfo(`Running: ${task.name}`);
      const result = task.action();
      results[task.name] = { success: true, result };

      if (task.required && !result.success) {
        hasErrors = true;
      }
    } catch (error) {
      results[task.name] = { success: false, error: error.message };
      logError(`${task.name} failed: ${error.message}`);

      if (task.required) {
        hasErrors = true;
      }
    }
  }

  return { results, hasErrors };
}

function generatePostInstallReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTasks: Object.keys(results).length,
      successfulTasks: Object.values(results).filter((r) => r.success).length,
      failedTasks: Object.values(results).filter((r) => !r.success).length,
    },
    results,
  };

  // Write report to file
  const reportPath = "post-install-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Main execution
async function main() {
  try {
    log("📦 Running post-install tasks...", colors.bright);

    const { results, hasErrors } = runPostInstallTasks();

    // Generate report
    const report = generatePostInstallReport(results);

    // Display summary
    log("\n📊 Post-Install Summary:", colors.bright);
    log(`   Total tasks: ${report.summary.totalTasks}`, colors.cyan);
    log(`   Successful: ${report.summary.successfulTasks}`, colors.green);
    log(
      `   Failed: ${report.summary.failedTasks}`,
      report.summary.failedTasks === 0 ? colors.green : colors.red,
    );

    if (hasErrors) {
      log(
        "\n⚠️  Post-install completed with some errors. Please review the failed tasks.",
        colors.yellow,
      );
    } else {
      log("\n✅ Post-install tasks completed successfully!", colors.green);
    }

    log("\n🎉 Installation complete! You can now:", colors.bright);
    log('   • Run "npm run dev" to start the development server', colors.cyan);
    log('   • Run "npm run storybook" to start Storybook', colors.cyan);
    log('   • Run "npm run test" to run tests', colors.cyan);
    log('   • Run "npm run lint" to check code quality', colors.cyan);

    log(
      `\n📄 Post-install report saved to: post-install-report.json`,
      colors.cyan,
    );
  } catch (error) {
    logError(`Post-install failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Post-Install Script", colors.bright);
    log("Usage: node scripts/post-install.js [options]");
    log("");
    log('This script runs automatically after "npm install" or "bun install"');
    log("to set up the development environment.");
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
  runPostInstallTasks,
  POST_INSTALL_TASKS,
};
