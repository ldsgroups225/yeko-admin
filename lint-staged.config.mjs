export default {
  // TypeScript and JavaScript files
  "*.{js,jsx,ts,tsx}": [
    "bunx biome check --write --no-errors-on-unmatched",
    "bunx biome format --write --no-errors-on-unmatched",
  ],

  // JSON files
  "*.json": ["bunx biome format --write --no-errors-on-unmatched"],

  // Markdown files
  "*.md": ["bunx biome format --write --no-errors-on-unmatched"],

  // CSS files
  "*.{css,scss}": ["bunx biome format --write --no-errors-on-unmatched"],

  // Package.json - format only
  "package.json": ["bunx biome format --write --no-errors-on-unmatched"],

  // Storybook stories - ensure they're properly formatted
  "*.stories.{js,jsx,ts,tsx}": [
    "bunx biome check --write --no-errors-on-unmatched",
    "bunx biome format --write --no-errors-on-unmatched",
  ],
};
