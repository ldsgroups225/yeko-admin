#!/usr/bin/env node

/**
 * Dependabot Management Script
 *
 * This script helps manage Dependabot configuration, monitor updates,
 * and provide insights into dependency management.
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

function checkDependabotConfig() {
  log("\n🔍 Checking Dependabot configuration...", colors.blue);

  const configFile = path.join(process.cwd(), ".github", "dependabot.yml");

  if (fs.existsSync(configFile)) {
    log("✅ Dependabot configuration found", colors.green);

    try {
      const config = fs.readFileSync(configFile, "utf8");

      // Basic validation
      if (config.includes("version: 2")) {
        log("✅ Configuration version is correct", colors.green);
      } else {
        log("⚠️ Configuration version might be outdated", colors.yellow);
      }

      // Check for npm ecosystem
      if (config.includes('package-ecosystem: "npm"')) {
        log("✅ NPM ecosystem configured", colors.green);
      } else {
        log("⚠️ NPM ecosystem not found", colors.yellow);
      }

      // Check for GitHub Actions ecosystem
      if (config.includes('package-ecosystem: "github-actions"')) {
        log("✅ GitHub Actions ecosystem configured", colors.green);
      } else {
        log("⚠️ GitHub Actions ecosystem not configured", colors.yellow);
      }

      // Check for grouping
      if (config.includes("groups:")) {
        log("✅ Update grouping configured", colors.green);
      } else {
        log("⚠️ No update grouping found", colors.yellow);
      }
    } catch (error) {
      log("❌ Error reading configuration file", colors.red);
      console.error(error);
    }
  } else {
    log("❌ Dependabot configuration not found", colors.red);
    log("💡 Run: node scripts/dependabot-manager.js init", colors.cyan);
  }
}

function analyzeDependencies() {
  log("\n📊 Analyzing dependencies...", colors.blue);

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    const totalDeps = Object.keys(dependencies).length;
    const totalDevDeps = Object.keys(devDependencies).length;

    log(`📦 Production dependencies: ${totalDeps}`, colors.cyan);
    log(`🔧 Development dependencies: ${totalDevDeps}`, colors.cyan);
    log(`📋 Total dependencies: ${totalDeps + totalDevDeps}`, colors.cyan);

    // Categorize dependencies
    const categories = {
      react: [],
      ui: [],
      testing: [],
      build: [],
      monitoring: [],
      types: [],
      other: [],
    };

    const allDeps = { ...dependencies, ...devDependencies };

    Object.keys(allDeps).forEach((dep) => {
      if (dep.includes("react") || dep === "next") {
        categories.react.push(dep);
      } else if (
        dep.includes("@radix-ui") ||
        dep.includes("tailwind") ||
        dep.includes("lucide")
      ) {
        categories.ui.push(dep);
      } else if (
        dep.includes("test") ||
        dep.includes("playwright") ||
        dep.includes("storybook") ||
        dep.includes("vitest")
      ) {
        categories.testing.push(dep);
      } else if (dep.includes("@types/")) {
        categories.types.push(dep);
      } else if (
        dep.includes("sentry") ||
        dep.includes("logtape") ||
        dep.includes("checkly")
      ) {
        categories.monitoring.push(dep);
      } else if (
        dep.includes("biome") ||
        dep.includes("typescript") ||
        dep.includes("lint")
      ) {
        categories.build.push(dep);
      } else {
        categories.other.push(dep);
      }
    });

    log("\n📂 Dependency categories:", colors.bright);
    Object.entries(categories).forEach(([category, deps]) => {
      if (deps.length > 0) {
        log(`  ${category}: ${deps.length} packages`, colors.cyan);
      }
    });
  } catch (error) {
    log("❌ Error analyzing dependencies", colors.red);
    console.error(error);
  }
}

function checkOutdatedDependencies() {
  log("\n🔍 Checking for outdated dependencies...", colors.blue);

  try {
    // Use bun to check for outdated packages
    const result = execSync("bun outdated", {
      encoding: "utf8",
      stdio: "pipe",
    });

    if (result.trim()) {
      log("📋 Outdated dependencies found:", colors.yellow);
      console.log(result);
    } else {
      log("✅ All dependencies are up to date", colors.green);
    }
  } catch (error) {
    if (error.status === 1) {
      // bun outdated returns exit code 1 when outdated packages are found
      log("📋 Outdated dependencies found:", colors.yellow);
      console.log(error.stdout);
    } else {
      log("❌ Error checking outdated dependencies", colors.red);
      console.error(error.message);
    }
  }
}

function checkVulnerabilities() {
  log("\n🔒 Checking for security vulnerabilities...", colors.blue);

  try {
    execSync("bun audit", { stdio: "inherit" });
    log("✅ No security vulnerabilities found", colors.green);
  } catch (error) {
    if (error.status === 1) {
      log("⚠️ Security vulnerabilities detected", colors.yellow);
      log(
        "💡 Dependabot will create PRs for security updates automatically",
        colors.cyan,
      );
    } else {
      log("❌ Error running security audit", colors.red);
    }
  }
}

function generateDependabotReport() {
  log("\n📄 Generating Dependabot report...", colors.blue);

  const reportPath = "dependabot-report.md";

  try {
    let report = "# Dependabot Management Report\n\n";
    report += `**Generated:** ${new Date().toISOString()}\n\n`;

    // Configuration status
    report += "## Configuration Status\n\n";
    const configExists = fs.existsSync(".github/dependabot.yml");
    report += `- **Configuration file:** ${configExists ? "✅ Present" : "❌ Missing"}\n`;
    report += `- **Auto-merge workflow:** ${fs.existsSync(".github/workflows/dependabot-auto-merge.yml") ? "✅ Present" : "❌ Missing"}\n\n`;

    // Dependency analysis
    report += "## Dependency Analysis\n\n";
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const deps = Object.keys(packageJson.dependencies || {}).length;
    const devDeps = Object.keys(packageJson.devDependencies || {}).length;

    report += `- **Production dependencies:** ${deps}\n`;
    report += `- **Development dependencies:** ${devDeps}\n`;
    report += `- **Total dependencies:** ${deps + devDeps}\n\n`;

    // Outdated packages
    report += "## Outdated Dependencies\n\n";
    try {
      const outdated = execSync("bun outdated", {
        encoding: "utf8",
        stdio: "pipe",
      });
      if (outdated.trim()) {
        report += "```\n" + outdated + "\n```\n\n";
      } else {
        report += "All dependencies are up to date.\n\n";
      }
    } catch (error) {
      if (error.stdout) {
        report += "```\n" + error.stdout + "\n```\n\n";
      } else {
        report += "Could not check outdated dependencies.\n\n";
      }
    }

    // Security audit
    report += "## Security Status\n\n";
    try {
      execSync("bun audit", { stdio: "pipe" });
      report += "No security vulnerabilities detected.\n\n";
    } catch (error) {
      report +=
        "Security vulnerabilities may be present. Run `bun audit` for details.\n\n";
    }

    // Recommendations
    report += "## Recommendations\n\n";
    report += "- Review and merge Dependabot PRs regularly\n";
    report += "- Monitor auto-merge workflow for any issues\n";
    report += "- Update Dependabot configuration as project evolves\n";
    report += "- Consider security updates as high priority\n\n";

    fs.writeFileSync(reportPath, report);
    log(`✅ Report generated: ${reportPath}`, colors.green);
  } catch (error) {
    log("❌ Error generating report", colors.red);
    console.error(error);
  }
}

function monitorDependabotPRs() {
  log("\n👀 Monitoring Dependabot PRs...", colors.blue);

  try {
    // This would require GitHub CLI or API access
    // For now, provide instructions
    log("💡 To monitor Dependabot PRs, use GitHub CLI:", colors.cyan);
    log('   gh pr list --author "dependabot[bot]"', colors.cyan);
    log("   gh pr view <pr-number>", colors.cyan);
    log("   gh pr merge <pr-number> --auto --squash", colors.cyan);
  } catch (error) {
    log("❌ Error monitoring PRs", colors.red);
    console.error(error);
  }
}

function validateAutoMergeRules() {
  log("\n🔍 Validating auto-merge rules...", colors.blue);

  const workflowFile = ".github/workflows/dependabot-auto-merge.yml";

  if (fs.existsSync(workflowFile)) {
    log("✅ Auto-merge workflow found", colors.green);

    const workflow = fs.readFileSync(workflowFile, "utf8");

    // Check for key components
    if (workflow.includes("validate-dependabot")) {
      log("✅ PR validation job configured", colors.green);
    }

    if (workflow.includes("wait-for-ci")) {
      log("✅ CI wait job configured", colors.green);
    }

    if (workflow.includes("auto-merge")) {
      log("✅ Auto-merge job configured", colors.green);
    }

    if (workflow.includes("SAFE_PATCH_DEPENDENCIES")) {
      log("✅ Safe dependency rules defined", colors.green);
    }

    if (workflow.includes("CRITICAL_DEPENDENCIES")) {
      log("✅ Critical dependency protection configured", colors.green);
    }
  } else {
    log("❌ Auto-merge workflow not found", colors.red);
    log("💡 Auto-merge workflow is recommended for safe updates", colors.cyan);
  }
}

function showHelp() {
  log("\n🤖 Dependabot Management Tool", colors.bright);
  log("\nUsage: node scripts/dependabot-manager.js [command]", colors.cyan);
  log("\nCommands:", colors.bright);
  log("  check         - Check Dependabot configuration");
  log("  analyze       - Analyze project dependencies");
  log("  outdated      - Check for outdated dependencies");
  log("  security      - Check for security vulnerabilities");
  log("  report        - Generate comprehensive report");
  log("  monitor       - Monitor Dependabot PRs");
  log("  validate      - Validate auto-merge rules");
  log("  help          - Show this help message");
  log("\nExamples:", colors.bright);
  log("  node scripts/dependabot-manager.js check");
  log("  node scripts/dependabot-manager.js analyze");
  log("  node scripts/dependabot-manager.js report");
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "check":
    checkDependabotConfig();
    break;

  case "analyze":
    analyzeDependencies();
    break;

  case "outdated":
    checkOutdatedDependencies();
    break;

  case "security":
    checkVulnerabilities();
    break;

  case "report":
    checkDependabotConfig();
    analyzeDependencies();
    checkOutdatedDependencies();
    checkVulnerabilities();
    generateDependabotReport();
    break;

  case "monitor":
    monitorDependabotPRs();
    break;

  case "validate":
    validateAutoMergeRules();
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
