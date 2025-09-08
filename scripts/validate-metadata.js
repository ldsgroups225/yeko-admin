#!/usr/bin/env node

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

// Validation rules
const VALIDATION_RULES = {
  metadata: {
    required: ["name", "version", "git", "build", "stats"],
    types: {
      name: "string",
      version: "string",
      git: "object",
      build: "object",
      stats: "object",
    },
  },
  routes: {
    required: ["path", "file", "type", "dynamic", "params"],
    types: {
      path: "string",
      file: "string",
      type: "string",
      dynamic: "boolean",
      params: "array",
    },
    validTypes: ["page", "api"],
  },
  components: {
    required: ["name", "file", "props", "imports", "size", "lastModified"],
    types: {
      name: "string",
      file: "string",
      props: "array",
      imports: "array",
      size: "number",
      lastModified: "object",
    },
  },
};

function validateType(value, expectedType) {
  if (expectedType === "array") {
    return Array.isArray(value);
  }
  if (expectedType === "object") {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  return typeof value === expectedType;
}

function validateMetadata(metadata, rules) {
  const errors = [];
  const warnings = [];

  // Check required fields
  for (const field of rules.required) {
    if (!(field in metadata)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check field types
  for (const [field, expectedType] of Object.entries(rules.types)) {
    if (field in metadata) {
      if (!validateType(metadata[field], expectedType)) {
        errors.push(
          `Invalid type for field '${field}': expected ${expectedType}, got ${typeof metadata[field]}`,
        );
      }
    }
  }

  // Check valid values for specific fields
  if (
    rules.validTypes &&
    metadata.type &&
    !rules.validTypes.includes(metadata.type)
  ) {
    errors.push(
      `Invalid type value: ${metadata.type}. Valid values: ${rules.validTypes.join(", ")}`,
    );
  }

  return { errors, warnings };
}

function validateFileStructure() {
  const errors = [];
  const warnings = [];

  const requiredFiles = [
    "src/lib/metadata/generated-metadata.ts",
    "src/lib/metadata/metadata-types.ts",
    "src/lib/metadata/routes-metadata.ts",
    "src/lib/metadata/components-metadata.ts",
    "src/lib/metadata/api-metadata.ts",
    "src/lib/metadata/index.ts",
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${file}`);
    } else {
      // Check if file is not empty
      const stats = fs.statSync(file);
      if (stats.size === 0) {
        warnings.push(`Empty file: ${file}`);
      }
    }
  }

  return { errors, warnings };
}

function validateRouteConsistency() {
  const errors = [];
  const warnings = [];

  try {
    // Read routes metadata
    const routesContent = fs.readFileSync(
      "src/lib/metadata/routes-metadata.ts",
      "utf8",
    );

    // Extract routes array (simplified parsing)
    const routesMatch = routesContent.match(
      /export const routes: RouteMetadata\[\] = (\[[\s\S]*?\]);/,
    );
    if (!routesMatch) {
      errors.push("Could not parse routes from routes-metadata.ts");
      return { errors, warnings };
    }

    const routes = JSON.parse(routesMatch[1]);

    // Validate each route
    for (const route of routes) {
      const validation = validateMetadata(route, VALIDATION_RULES.routes);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);

      // Check if route file exists
      if (route.file && !fs.existsSync(route.file)) {
        errors.push(`Route file does not exist: ${route.file}`);
      }

      // Check for duplicate paths
      const duplicateRoutes = routes.filter((r) => r.path === route.path);
      if (duplicateRoutes.length > 1) {
        errors.push(`Duplicate route path: ${route.path}`);
      }
    }
  } catch (error) {
    errors.push(`Error validating routes: ${error.message}`);
  }

  return { errors, warnings };
}

function validateComponentConsistency() {
  const errors = [];
  const warnings = [];

  try {
    // Read components metadata
    const componentsContent = fs.readFileSync(
      "src/lib/metadata/components-metadata.ts",
      "utf8",
    );

    // Extract components array (simplified parsing)
    const componentsMatch = componentsContent.match(
      /export const components: ComponentMetadata\[\] = (\[[\s\S]*?\]);/,
    );
    if (!componentsMatch) {
      errors.push("Could not parse components from components-metadata.ts");
      return { errors, warnings };
    }

    const components = JSON.parse(componentsMatch[1]);

    // Validate each component
    for (const component of components) {
      const validation = validateMetadata(
        component,
        VALIDATION_RULES.components,
      );
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);

      // Check if component file exists
      if (component.file && !fs.existsSync(component.file)) {
        errors.push(`Component file does not exist: ${component.file}`);
      }

      // Check for duplicate component names
      const duplicateComponents = components.filter(
        (c) => c.name === component.name,
      );
      if (duplicateComponents.length > 1) {
        warnings.push(`Duplicate component name: ${component.name}`);
      }
    }
  } catch (error) {
    errors.push(`Error validating components: ${error.message}`);
  }

  return { errors, warnings };
}

function validateProjectMetadata() {
  const errors = [];
  const warnings = [];

  try {
    // Read project metadata
    const metadataContent = fs.readFileSync(
      "src/lib/metadata/generated-metadata.ts",
      "utf8",
    );

    // Extract project metadata (simplified parsing)
    const metadataMatch = metadataContent.match(
      /export const projectMetadata: ProjectMetadata = ({[\s\S]*?});/,
    );
    if (!metadataMatch) {
      errors.push(
        "Could not parse project metadata from generated-metadata.ts",
      );
      return { errors, warnings };
    }

    const metadata = JSON.parse(metadataMatch[1]);

    // Validate metadata structure
    const validation = validateMetadata(metadata, VALIDATION_RULES.metadata);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    // Check version format
    if (metadata.version && !/^\d+\.\d+\.\d+/.test(metadata.version)) {
      warnings.push(`Version format might be invalid: ${metadata.version}`);
    }

    // Check git information
    if (metadata.git) {
      if (metadata.git.commit === "unknown") {
        warnings.push("Git commit information is unknown");
      }
      if (metadata.git.branch === "unknown") {
        warnings.push("Git branch information is unknown");
      }
    }

    // Check build timestamp
    if (metadata.build && metadata.build.timestamp) {
      const buildTime = new Date(metadata.build.timestamp);
      const now = new Date();
      const diffHours = (now - buildTime) / (1000 * 60 * 60);

      if (diffHours > 24) {
        warnings.push(`Metadata is ${Math.round(diffHours)} hours old`);
      }
    }
  } catch (error) {
    errors.push(`Error validating project metadata: ${error.message}`);
  }

  return { errors, warnings };
}

function validateTypeScriptCompatibility() {
  const errors = [];
  const warnings = [];

  try {
    // Check if TypeScript can compile the metadata files
    const { execSync } = require("node:child_process");

    execSync("npx tsc --noEmit src/lib/metadata/*.ts", {
      stdio: "pipe",
      cwd: process.cwd(),
    });

    logSuccess("TypeScript compilation successful");
  } catch (error) {
    errors.push(`TypeScript compilation failed: ${error.message}`);
  }

  return { errors, warnings };
}

function generateValidationReport(allErrors, allWarnings) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      status: allErrors.length === 0 ? "PASS" : "FAIL",
    },
    errors: allErrors,
    warnings: allWarnings,
  };

  // Write report to file
  const reportPath = "metadata-validation-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Main validation function
async function main() {
  log("🔍 Starting metadata validation...", colors.bright);

  const allErrors = [];
  const allWarnings = [];

  try {
    // Validate file structure
    logInfo("Validating file structure...");
    const fileValidation = validateFileStructure();
    allErrors.push(...fileValidation.errors);
    allWarnings.push(...fileValidation.warnings);

    // Validate project metadata
    logInfo("Validating project metadata...");
    const projectValidation = validateProjectMetadata();
    allErrors.push(...projectValidation.errors);
    allWarnings.push(...projectValidation.warnings);

    // Validate routes
    logInfo("Validating routes...");
    const routesValidation = validateRouteConsistency();
    allErrors.push(...routesValidation.errors);
    allWarnings.push(...routesValidation.warnings);

    // Validate components
    logInfo("Validating components...");
    const componentsValidation = validateComponentConsistency();
    allErrors.push(...componentsValidation.errors);
    allWarnings.push(...componentsValidation.warnings);

    // Validate TypeScript compatibility
    logInfo("Validating TypeScript compatibility...");
    const tsValidation = validateTypeScriptCompatibility();
    allErrors.push(...tsValidation.errors);
    allWarnings.push(...tsValidation.warnings);

    // Generate report
    const report = generateValidationReport(allErrors, allWarnings);

    // Display results
    log("\n📊 Validation Results:", colors.bright);
    log(
      `   Status: ${report.summary.status}`,
      report.summary.status === "PASS" ? colors.green : colors.red,
    );
    log(
      `   Errors: ${report.summary.totalErrors}`,
      report.summary.totalErrors === 0 ? colors.green : colors.red,
    );
    log(
      `   Warnings: ${report.summary.totalWarnings}`,
      report.summary.totalWarnings === 0 ? colors.green : colors.yellow,
    );

    if (allErrors.length > 0) {
      log("\n❌ Errors:", colors.red);
      allErrors.forEach((error, index) => {
        log(`   ${index + 1}. ${error}`, colors.red);
      });
    }

    if (allWarnings.length > 0) {
      log("\n⚠️  Warnings:", colors.yellow);
      allWarnings.forEach((warning, index) => {
        log(`   ${index + 1}. ${warning}`, colors.yellow);
      });
    }

    log(
      `\n📄 Validation report saved to: metadata-validation-report.json`,
      colors.cyan,
    );

    if (allErrors.length === 0) {
      logSuccess("All validations passed!");
      process.exit(0);
    } else {
      logError("Validation failed with errors!");
      process.exit(1);
    }
  } catch (error) {
    logError(`Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Metadata Validation Script", colors.bright);
    log("Usage: node scripts/validate-metadata.js [options]");
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --strict       Treat warnings as errors");
    log("  --json         Output results in JSON format");
    log("  --quiet        Suppress output except errors");
    log("");
    process.exit(0);
  }

  main();
}

module.exports = {
  validateMetadata: main,
  VALIDATION_RULES,
};
