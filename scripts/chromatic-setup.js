#!/usr/bin/env node

/**
 * Chromatic Setup and Testing Helper Script
 *
 * This script helps with Chromatic setup and provides utilities for
 * visual regression testing workflows.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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

function checkEnvironment() {
  log("\n🔍 Checking Chromatic environment...", colors.blue);

  const envFile = path.join(process.cwd(), ".env.local");
  const hasEnvFile = fs.existsSync(envFile);

  if (!hasEnvFile) {
    log("⚠️  No .env.local file found", colors.yellow);
    log(
      "💡 Create .env.local with CHROMATIC_PROJECT_TOKEN for local testing",
      colors.cyan,
    );
  }

  const hasToken = process.env.CHROMATIC_PROJECT_TOKEN;
  if (!hasToken) {
    log("⚠️  CHROMATIC_PROJECT_TOKEN not found in environment", colors.yellow);
    log("💡 Set CHROMATIC_PROJECT_TOKEN environment variable", colors.cyan);
  } else {
    log("✅ CHROMATIC_PROJECT_TOKEN found", colors.green);
  }

  // Check if Storybook is configured
  const storybookConfig = path.join(process.cwd(), ".storybook", "main.ts");
  if (fs.existsSync(storybookConfig)) {
    log("✅ Storybook configuration found", colors.green);
  } else {
    log("❌ Storybook configuration not found", colors.red);
    log("💡 Run: bun run storybook to set up Storybook first", colors.cyan);
  }
}

function buildStorybook() {
  log("\n📦 Building Storybook...", colors.blue);
  try {
    execSync("bun run build-storybook", { stdio: "inherit" });
    log("✅ Storybook build completed", colors.green);
  } catch (error) {
    log("❌ Storybook build failed", colors.red);
    process.exit(1);
  }
}

function runChromatic(options = {}) {
  log("\n🎨 Running Chromatic...", colors.blue);

  if (!process.env.CHROMATIC_PROJECT_TOKEN) {
    log("❌ CHROMATIC_PROJECT_TOKEN is required", colors.red);
    log("💡 Set the environment variable or add it to .env.local", colors.cyan);
    process.exit(1);
  }

  let command = "bun run chromatic";

  if (options.exitZeroOnChanges) {
    command += " --exit-zero-on-changes";
  }

  if (options.onlyChanged) {
    command += " --only-changed";
  }

  if (options.debug) {
    command += " --debug";
  }

  if (options.dryRun) {
    command += " --dry-run";
  }

  try {
    execSync(command, { stdio: "inherit" });
    log("✅ Chromatic completed successfully", colors.green);
  } catch (error) {
    log("❌ Chromatic failed", colors.red);
    if (!options.exitZeroOnChanges) {
      process.exit(1);
    }
  }
}

function showHelp() {
  log("\n🎨 Chromatic Setup and Testing Helper", colors.bright);
  log(
    "\nUsage: node scripts/chromatic-setup.js [command] [options]",
    colors.cyan,
  );
  log("\nCommands:", colors.bright);
  log("  check     - Check environment and configuration");
  log("  build     - Build Storybook for testing");
  log("  test      - Run Chromatic visual tests");
  log("  ci        - Run Chromatic in CI mode (exit-zero-on-changes)");
  log("  debug     - Run Chromatic with debug output");
  log("  dry-run   - Run Chromatic without uploading");
  log("  help      - Show this help message");
  log("\nExamples:", colors.bright);
  log("  node scripts/chromatic-setup.js check");
  log("  node scripts/chromatic-setup.js test");
  log("  node scripts/chromatic-setup.js ci");
  log("  node scripts/chromatic-setup.js debug");
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "check":
    checkEnvironment();
    break;

  case "build":
    buildStorybook();
    break;

  case "test":
    checkEnvironment();
    buildStorybook();
    runChromatic();
    break;

  case "ci":
    checkEnvironment();
    buildStorybook();
    runChromatic({ exitZeroOnChanges: true });
    break;

  case "debug":
    checkEnvironment();
    buildStorybook();
    runChromatic({ debug: true, exitZeroOnChanges: true });
    break;

  case "dry-run":
    checkEnvironment();
    buildStorybook();
    runChromatic({ dryRun: true, exitZeroOnChanges: true });
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
