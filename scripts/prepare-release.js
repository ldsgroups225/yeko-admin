#!/usr/bin/env node

/**
 * Prepare Release Script
 * This script prepares the project for a new release
 */

const fs = require("node:fs");
const _path = require("node:path");

console.log("🚀 Preparing release...");

// Check if we're in a git repository
if (!fs.existsSync(".git")) {
  console.error("❌ Not in a git repository");
  process.exit(1);
}

// Check if package.json exists
if (!fs.existsSync("package.json")) {
  console.error("❌ package.json not found");
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

console.log(`📦 Current version: ${packageJson.version}`);
console.log("✅ Release preparation completed");

process.exit(0);
