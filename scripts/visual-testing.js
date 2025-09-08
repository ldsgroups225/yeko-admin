#!/usr/bin/env node

/**
 * Visual Testing Management Script
 *
 * This script helps manage visual regression testing with Playwright,
 * including baseline management, test execution, and result analysis.
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

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

function checkPlaywrightSetup() {
  log("\n🔍 Checking Playwright setup...", colors.blue);

  const configFile = path.join(process.cwd(), "playwright.config.ts");
  if (fs.existsSync(configFile)) {
    log("✅ Playwright configuration found", colors.green);
  } else {
    log("❌ Playwright configuration not found", colors.red);
    log("💡 Run: bun add -D @playwright/test", colors.cyan);
    process.exit(1);
  }

  const testsDir = path.join(process.cwd(), "tests");
  if (fs.existsSync(testsDir)) {
    log("✅ Tests directory found", colors.green);

    const visualTests = fs
      .readdirSync(testsDir, { recursive: true })
      .filter((file) => file.includes("visual") && file.endsWith(".spec.ts"));

    log(`📁 Found ${visualTests.length} visual test files`, colors.cyan);
  } else {
    log("⚠️  Tests directory not found", colors.yellow);
  }
}

function runVisualTests(options = {}) {
  log("\n🎭 Running visual regression tests...", colors.blue);

  let command = "bunx playwright test";

  if (options.grep) {
    command += ` --grep "${options.grep}"`;
  }

  if (options.project) {
    command += ` --project=${options.project}`;
  }

  if (options.updateSnapshots) {
    command += " --update-snapshots";
  }

  if (options.debug) {
    command += " --debug";
  }

  if (options.headed) {
    command += " --headed";
  }

  if (options.workers) {
    command += ` --workers=${options.workers}`;
  }

  // Focus on visual tests
  if (!options.grep) {
    command += " tests/visual/";
  }

  try {
    log(`🚀 Executing: ${command}`, colors.cyan);
    execSync(command, { stdio: "inherit" });
    log("✅ Visual tests completed successfully", colors.green);
  } catch (_error) {
    log("❌ Visual tests failed", colors.red);
    if (!options.continueOnFailure) {
      process.exit(1);
    }
  }
}

function updateBaselines() {
  log("\n📸 Updating visual test baselines...", colors.blue);

  try {
    execSync("bunx playwright test tests/visual/ --update-snapshots", {
      stdio: "inherit",
    });
    log("✅ Baselines updated successfully", colors.green);
    log("💡 Review the updated screenshots before committing", colors.cyan);
  } catch (_error) {
    log("❌ Failed to update baselines", colors.red);
    process.exit(1);
  }
}

function showTestReport() {
  log("\n📊 Opening test report...", colors.blue);

  try {
    execSync("bunx playwright show-report", { stdio: "inherit" });
  } catch (_error) {
    log("❌ Failed to open test report", colors.red);
    log("💡 Run tests first to generate a report", colors.cyan);
  }
}

function installBrowsers() {
  log("\n🌐 Installing Playwright browsers...", colors.blue);

  try {
    execSync("bunx playwright install", { stdio: "inherit" });
    log("✅ Browsers installed successfully", colors.green);
  } catch (_error) {
    log("❌ Failed to install browsers", colors.red);
    process.exit(1);
  }
}

function cleanupScreenshots() {
  log("\n🧹 Cleaning up old screenshots...", colors.blue);

  const testResultsDir = path.join(process.cwd(), "test-results");
  const playwrightReportDir = path.join(process.cwd(), "playwright-report");

  try {
    if (fs.existsSync(testResultsDir)) {
      fs.rmSync(testResultsDir, { recursive: true, force: true });
      log("✅ Cleaned test-results directory", colors.green);
    }

    if (fs.existsSync(playwrightReportDir)) {
      fs.rmSync(playwrightReportDir, { recursive: true, force: true });
      log("✅ Cleaned playwright-report directory", colors.green);
    }

    log("✅ Cleanup completed", colors.green);
  } catch (error) {
    log("❌ Cleanup failed", colors.red);
    console.error(error);
  }
}

function analyzeScreenshots() {
  log("\n🔍 Analyzing screenshot differences...", colors.blue);

  const testResultsDir = path.join(process.cwd(), "test-results");

  if (!fs.existsSync(testResultsDir)) {
    log("⚠️  No test results found", colors.yellow);
    log("💡 Run visual tests first", colors.cyan);
    return;
  }

  try {
    const results = fs.readdirSync(testResultsDir, { recursive: true });
    const diffImages = results.filter(
      (file) => typeof file === "string" && file.includes("-diff.png"),
    );

    if (diffImages.length === 0) {
      log("✅ No visual differences found", colors.green);
    } else {
      log(`⚠️  Found ${diffImages.length} visual differences:`, colors.yellow);
      diffImages.forEach((diff) => {
        log(`   - ${diff}`, colors.cyan);
      });
      log("💡 Review differences in the test report", colors.cyan);
    }
  } catch (error) {
    log("❌ Failed to analyze screenshots", colors.red);
    console.error(error);
  }
}

function showHelp() {
  log("\n🎭 Playwright Visual Testing Manager", colors.bright);
  log(
    "\nUsage: node scripts/visual-testing.js [command] [options]",
    colors.cyan,
  );
  log("\nCommands:", colors.bright);
  log("  check         - Check Playwright setup and configuration");
  log("  test          - Run visual regression tests");
  log("  update        - Update visual test baselines");
  log("  report        - Show test report");
  log("  install       - Install Playwright browsers");
  log("  cleanup       - Clean up old screenshots and reports");
  log("  analyze       - Analyze screenshot differences");
  log("  help          - Show this help message");
  log("\nTest Options:", colors.bright);
  log("  --grep <pattern>     - Run tests matching pattern");
  log("  --project <name>     - Run tests for specific project");
  log("  --update-snapshots   - Update snapshots during test run");
  log("  --debug              - Run tests in debug mode");
  log("  --headed             - Run tests in headed mode");
  log("  --workers <number>   - Number of parallel workers");
  log("\nExamples:", colors.bright);
  log("  node scripts/visual-testing.js check");
  log('  node scripts/visual-testing.js test --grep "auth"');
  log("  node scripts/visual-testing.js test --project chromium");
  log("  node scripts/visual-testing.js update");
  log("  node scripts/visual-testing.js test --debug --headed");
}

// Parse command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

const options = {
  grep:
    args.find((arg) => arg.startsWith("--grep"))?.split("=")[1] ||
    (args.includes("--grep") ? args[args.indexOf("--grep") + 1] : null),
  project:
    args.find((arg) => arg.startsWith("--project"))?.split("=")[1] ||
    (args.includes("--project") ? args[args.indexOf("--project") + 1] : null),
  updateSnapshots: args.includes("--update-snapshots"),
  debug: args.includes("--debug"),
  headed: args.includes("--headed"),
  workers:
    args.find((arg) => arg.startsWith("--workers"))?.split("=")[1] ||
    (args.includes("--workers") ? args[args.indexOf("--workers") + 1] : null),
  continueOnFailure: args.includes("--continue-on-failure"),
};

// Main execution
switch (command) {
  case "check":
    checkPlaywrightSetup();
    break;

  case "test":
    checkPlaywrightSetup();
    runVisualTests(options);
    break;

  case "update":
    checkPlaywrightSetup();
    updateBaselines();
    break;

  case "report":
    showTestReport();
    break;

  case "install":
    installBrowsers();
    break;

  case "cleanup":
    cleanupScreenshots();
    break;

  case "analyze":
    analyzeScreenshots();
    break;

  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;

  default:
    if (!command) {
      showHelp();
    } else {
      log(`❌ Unknown command: ${command}`, colors.red);
      showHelp();
      process.exit(1);
    }
}
