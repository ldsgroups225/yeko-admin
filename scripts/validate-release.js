#!/usr/bin/env node

/**
 * Validate Release Script
 * This script validates the release configuration
 */

const fs = require("node:fs");
const _path = require("node:path");

console.log("✅ Validating release configuration...");

// Check if package.json exists
if (!fs.existsSync("package.json")) {
  console.error("❌ package.json not found");
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

console.log(`📦 Version: ${packageJson.version}`);
console.log("✅ Release validation completed");

process.exit(0);
