#!/usr/bin/env node

/**
 * Check Release Script
 * This script checks if the project is ready for release
 */

const fs = require("node:fs");
const _path = require("node:path");

console.log("🔍 Checking release readiness...");

// Check if package.json exists
if (!fs.existsSync("package.json")) {
  console.error("❌ package.json not found");
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

console.log(`📦 Version: ${packageJson.version}`);
console.log("✅ Release check completed");

process.exit(0);
