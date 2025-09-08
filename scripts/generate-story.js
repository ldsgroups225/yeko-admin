#!/usr/bin/env node

/**
 * Story Generation Utility
 *
 * This script generates Storybook stories for UI components using standardized templates.
 * Usage: node scripts/generate-story.js --component ComponentName --type basic|complex|form
 */

const fs = require("node:fs");
const path = require("node:path");

// Parse command line arguments
const args = process.argv.slice(2);
const componentArg = args.find((arg) => arg.startsWith("--component="));
const typeArg = args.find((arg) => arg.startsWith("--type="));

if (!componentArg || !typeArg) {
  console.error(
    "Usage: node scripts/generate-story.js --component=ComponentName --type=basic|complex|form",
  );
  console.error(
    "Example: node scripts/generate-story.js --component=Badge --type=basic",
  );
  process.exit(1);
}

const componentName = componentArg.split("=")[1];
const storyType = typeArg.split("=")[1];

// Validate story type
const validTypes = ["basic", "complex", "form"];
if (!validTypes.includes(storyType)) {
  console.error(
    `Invalid story type: ${storyType}. Must be one of: ${validTypes.join(", ")}`,
  );
  process.exit(1);
}

// Template mapping
const templateMap = {
  basic: "basic-component.stories.tsx",
  complex: "complex-component.stories.tsx",
  form: "form-component.stories.tsx",
};

// File paths
const templatePath = path.join(
  __dirname,
  "..",
  ".storybook",
  "templates",
  templateMap[storyType],
);
const componentDir = path.join(__dirname, "..", "src", "components", "ui");
const storyPath = path.join(
  componentDir,
  `${componentName.toLowerCase()}.stories.tsx`,
);

// Check if component directory exists
if (!fs.existsSync(componentDir)) {
  console.error(`Component directory not found: ${componentDir}`);
  process.exit(1);
}

// Check if story already exists
if (fs.existsSync(storyPath)) {
  console.error(`Story file already exists: ${storyPath}`);
  console.error(
    "Please remove the existing file or choose a different component name.",
  );
  process.exit(1);
}

// Check if template exists
if (!fs.existsSync(templatePath)) {
  console.error(`Template file not found: ${templatePath}`);
  process.exit(1);
}

try {
  // Read template
  let template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders
  template = template
    .replace(/ComponentName/g, componentName)
    .replace(/component-name/g, componentName.toLowerCase())
    .replace(/UI\/ComponentName/g, `UI/${componentName}`)
    .replace(/\.\/component-name/g, `./${componentName.toLowerCase()}`);

  // Write story file
  fs.writeFileSync(storyPath, template);

  console.log(`✅ Generated ${storyType} story for ${componentName}`);
  console.log(`📁 File created: ${storyPath}`);
  console.log("");
  console.log("Next steps:");
  console.log("1. Update the component import path if needed");
  console.log("2. Customize the argTypes and stories for your component");
  console.log("3. Add component-specific props and variants");
  console.log("4. Test the story in Storybook");
  console.log("");
  console.log("Run Storybook: bun run storybook");
} catch (error) {
  console.error("Error generating story:", error.message);
  process.exit(1);
}
