#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

// Configuration
const CONFIG = {
  srcDir: "src",
  outputDir: "src/lib/metadata",
  metadataFile: "generated-metadata.ts",
  typesFile: "metadata-types.ts",
  routesFile: "routes-metadata.ts",
  componentsFile: "components-metadata.ts",
  apiFile: "api-metadata.ts",
};

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

// Utility functions
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logInfo(`Created directory: ${dirPath}`);
  }
}

function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime,
    };
  } catch (_error) {
    return null;
  }
}

function getGitInfo() {
  try {
    const branch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    const commit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    const shortCommit = commit.substring(0, 7);
    const lastCommit = execSync('git log -1 --pretty=format:"%h %s"', {
      encoding: "utf8",
    }).trim();

    return {
      branch,
      commit,
      shortCommit,
      lastCommit,
      timestamp: new Date().toISOString(),
    };
  } catch (_error) {
    logWarning("Could not get git information");
    return {
      branch: "unknown",
      commit: "unknown",
      shortCommit: "unknown",
      lastCommit: "unknown",
      timestamp: new Date().toISOString(),
    };
  }
}

function getPackageInfo() {
  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      license: packageJson.license,
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
    };
  } catch (_error) {
    logError("Could not read package.json");
    return null;
  }
}

function scanDirectory(dirPath, extensions = [".ts", ".tsx", ".js", ".jsx"]) {
  const files = [];

  function scan(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules, .next, and other build directories
          if (
            !["node_modules", ".next", "dist", "build", ".git"].includes(item)
          ) {
            scan(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push({
              path: fullPath,
              relativePath: path.relative(process.cwd(), fullPath),
              name: item,
              extension: ext,
              stats: getFileStats(fullPath),
            });
          }
        }
      }
    } catch (_error) {
      logWarning(`Could not scan directory: ${currentPath}`);
    }
  }

  scan(dirPath);
  return files;
}

function extractRouteMetadata(files) {
  const routes = [];
  const apiRoutes = [];

  for (const file of files) {
    const relativePath = file.relativePath;

    // Extract Next.js app router routes
    if (relativePath.includes("/app/") && file.name === "page.tsx") {
      const routePath = relativePath
        .replace("src/app/", "/")
        .replace("/page.tsx", "")
        .replace(/\[([^\]]+)\]/g, ":$1"); // Convert [param] to :param

      routes.push({
        path: routePath || "/",
        file: relativePath,
        type: "page",
        dynamic: routePath.includes(":"),
        params: routePath.match(/:([^/]+)/g) || [],
      });
    }

    // Extract API routes
    if (relativePath.includes("/api/") && file.name === "route.ts") {
      const apiPath = relativePath
        .replace("src/app/api/", "/api/")
        .replace("/route.ts", "")
        .replace(/\[([^\]]+)\]/g, ":$1");

      apiRoutes.push({
        path: apiPath,
        file: relativePath,
        type: "api",
        dynamic: apiPath.includes(":"),
        params: apiPath.match(/:([^/]+)/g) || [],
      });
    }
  }

  return { routes, apiRoutes };
}

function extractComponentMetadata(files) {
  const components = [];

  for (const file of files) {
    if (
      file.relativePath.includes("/components/") &&
      file.extension === ".tsx"
    ) {
      const content = fs.readFileSync(file.path, "utf8");

      // Extract component name from file content
      const componentMatch = content.match(
        /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/,
      );
      const componentName = componentMatch
        ? componentMatch[1]
        : path.basename(file.name, ".tsx");

      // Extract props interface
      const propsMatch = content.match(/interface\s+(\w+Props)\s*\{([^}]+)\}/);
      const props = propsMatch
        ? propsMatch[2]
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : [];

      // Extract imports
      const importMatches =
        content.match(/import\s+.*?from\s+['"]([^'"]+)['"]/g) || [];
      const imports = importMatches
        .map((imp) => {
          const match = imp.match(/from\s+['"]([^'"]+)['"]/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      components.push({
        name: componentName,
        file: file.relativePath,
        props: props,
        imports: imports,
        size: file.stats?.size || 0,
        lastModified: file.stats?.modified || new Date(),
      });
    }
  }

  return components;
}

function generateMetadataTypes() {
  return `// Auto-generated metadata types
// Generated on: ${new Date().toISOString()}

export interface RouteMetadata {
  path: string;
  file: string;
  type: 'page' | 'api';
  dynamic: boolean;
  params: string[];
}

export interface ComponentMetadata {
  name: string;
  file: string;
  props: string[];
  imports: string[];
  size: number;
  lastModified: Date;
}

export interface ProjectMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  dependencies: string[];
  devDependencies: string[];
  git: {
    branch: string;
    commit: string;
    shortCommit: string;
    lastCommit: string;
    timestamp: string;
  };
  build: {
    timestamp: string;
    environment: string;
    nodeVersion: string;
  };
  stats: {
    totalFiles: number;
    totalRoutes: number;
    totalApiRoutes: number;
    totalComponents: number;
    totalSize: number;
  };
}

export interface FileMetadata {
  path: string;
  relativePath: string;
  name: string;
  extension: string;
  stats: {
    size: number;
    modified: Date;
    created: Date;
  } | null;
}
`;
}

function generateRoutesMetadata(routes, apiRoutes) {
  return `// Auto-generated routes metadata
// Generated on: ${new Date().toISOString()}

import type { RouteMetadata } from './metadata-types';

export const routes: RouteMetadata[] = ${JSON.stringify(routes, null, 2)};

export const apiRoutes: RouteMetadata[] = ${JSON.stringify(apiRoutes, null, 2)};

export const allRoutes: RouteMetadata[] = [...routes, ...apiRoutes];

export function findRoute(path: string): RouteMetadata | undefined {
  return allRoutes.find(route => route.path === path);
}

export function findRoutesByType(type: 'page' | 'api'): RouteMetadata[] {
  return allRoutes.filter(route => route.type === type);
}

export function findDynamicRoutes(): RouteMetadata[] {
  return allRoutes.filter(route => route.dynamic);
}

export function getRouteParams(path: string): string[] {
  const route = findRoute(path);
  return route ? route.params : [];
}
`;
}

function generateComponentsMetadata(components) {
  return `// Auto-generated components metadata
// Generated on: ${new Date().toISOString()}

import type { ComponentMetadata } from './metadata-types';

export const components: ComponentMetadata[] = ${JSON.stringify(components, null, 2)};

export function findComponent(name: string): ComponentMetadata | undefined {
  return components.find(component => component.name === name);
}

export function findComponentsByFile(file: string): ComponentMetadata[] {
  return components.filter(component => component.file === file);
}

export function getComponentImports(name: string): string[] {
  const component = findComponent(name);
  return component ? component.imports : [];
}

export function getComponentProps(name: string): string[] {
  const component = findComponent(name);
  return component ? component.props : [];
}

export function getComponentsBySize(minSize: number): ComponentMetadata[] {
  return components.filter(component => component.size >= minSize);
}
`;
}

function generateMainMetadata(
  projectInfo,
  gitInfo,
  files,
  routes,
  apiRoutes,
  components,
) {
  const totalSize = files.reduce(
    (sum, file) => sum + (file.stats?.size || 0),
    0,
  );

  const metadata = {
    name: projectInfo?.name || "yeko-admin",
    version: projectInfo?.version || "0.1.0",
    description: projectInfo?.description,
    author: projectInfo?.author,
    license: projectInfo?.license,
    dependencies: projectInfo?.dependencies || [],
    devDependencies: projectInfo?.devDependencies || [],
    git: gitInfo,
    build: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    },
    stats: {
      totalFiles: files.length,
      totalRoutes: routes.length,
      totalApiRoutes: apiRoutes.length,
      totalComponents: components.length,
      totalSize,
    },
  };

  return `// Auto-generated project metadata
// Generated on: ${new Date().toISOString()}

import type { ProjectMetadata } from './metadata-types';

export const projectMetadata: ProjectMetadata = ${JSON.stringify(metadata, null, 2)};

export function getProjectInfo(): ProjectMetadata {
  return projectMetadata;
}

export function getBuildInfo() {
  return projectMetadata.build;
}

export function getGitInfo() {
  return projectMetadata.git;
}

export function getProjectStats() {
  return projectMetadata.stats;
}

export function getDependencies() {
  return {
    dependencies: projectMetadata.dependencies,
    devDependencies: projectMetadata.devDependencies,
  };
}
`;
}

function generateApiMetadata(apiRoutes) {
  return `// Auto-generated API metadata
// Generated on: ${new Date().toISOString()}

import type { RouteMetadata } from './metadata-types';

export const apiEndpoints: RouteMetadata[] = ${JSON.stringify(apiRoutes, null, 2)};

export function getApiEndpoints(): RouteMetadata[] {
  return apiEndpoints;
}

export function findApiEndpoint(path: string): RouteMetadata | undefined {
  return apiEndpoints.find(endpoint => endpoint.path === path);
}

export function getApiEndpointsByMethod(method: string): RouteMetadata[] {
  // This would need to be enhanced to parse actual HTTP methods from route files
  return apiEndpoints;
}

export function getDynamicApiEndpoints(): RouteMetadata[] {
  return apiEndpoints.filter(endpoint => endpoint.dynamic);
}

export function getApiEndpointParams(path: string): string[] {
  const endpoint = findApiEndpoint(path);
  return endpoint ? endpoint.params : [];
}
`;
}

// Main execution
async function main() {
  log("🚀 Starting metadata generation...", colors.bright);

  try {
    // Ensure output directory exists
    ensureDirectoryExists(CONFIG.outputDir);

    // Get project information
    logInfo("Collecting project information...");
    const projectInfo = getPackageInfo();
    const gitInfo = getGitInfo();

    // Scan source files
    logInfo("Scanning source files...");
    const files = scanDirectory(CONFIG.srcDir);
    logSuccess(`Found ${files.length} source files`);

    // Extract metadata
    logInfo("Extracting route metadata...");
    const { routes, apiRoutes } = extractRouteMetadata(files);
    logSuccess(
      `Found ${routes.length} routes and ${apiRoutes.length} API routes`,
    );

    logInfo("Extracting component metadata...");
    const components = extractComponentMetadata(files);
    logSuccess(`Found ${components.length} components`);

    // Generate metadata files
    logInfo("Generating metadata files...");

    // Generate types
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.typesFile),
      generateMetadataTypes(),
    );
    logSuccess(`Generated ${CONFIG.typesFile}`);

    // Generate routes metadata
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.routesFile),
      generateRoutesMetadata(routes, apiRoutes),
    );
    logSuccess(`Generated ${CONFIG.routesFile}`);

    // Generate components metadata
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.componentsFile),
      generateComponentsMetadata(components),
    );
    logSuccess(`Generated ${CONFIG.componentsFile}`);

    // Generate API metadata
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.apiFile),
      generateApiMetadata(apiRoutes),
    );
    logSuccess(`Generated ${CONFIG.apiFile}`);

    // Generate main metadata
    fs.writeFileSync(
      path.join(CONFIG.outputDir, CONFIG.metadataFile),
      generateMainMetadata(
        projectInfo,
        gitInfo,
        files,
        routes,
        apiRoutes,
        components,
      ),
    );
    logSuccess(`Generated ${CONFIG.metadataFile}`);

    // Generate index file
    const indexContent = `// Auto-generated metadata index
// Generated on: ${new Date().toISOString()}

export * from './metadata-types';
export * from './generated-metadata';
export * from './routes-metadata';
export * from './components-metadata';
export * from './api-metadata';
`;

    fs.writeFileSync(path.join(CONFIG.outputDir, "index.ts"), indexContent);
    logSuccess("Generated index.ts");

    // Summary
    log("\n📊 Metadata Generation Summary:", colors.bright);
    log(`   Files scanned: ${files.length}`, colors.cyan);
    log(`   Routes found: ${routes.length}`, colors.cyan);
    log(`   API routes found: ${apiRoutes.length}`, colors.cyan);
    log(`   Components found: ${components.length}`, colors.cyan);
    log(
      `   Total size: ${(files.reduce((sum, file) => sum + (file.stats?.size || 0), 0) / 1024).toFixed(2)} KB`,
      colors.cyan,
    );
    log(`   Output directory: ${CONFIG.outputDir}`, colors.cyan);

    logSuccess("Metadata generation completed successfully!");
  } catch (error) {
    logError(`Metadata generation failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Metadata Generation Script", colors.bright);
    log("Usage: node scripts/generate-metadata.js [options]");
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --watch, -w    Watch for changes and regenerate");
    log("  --verbose, -v  Enable verbose output");
    log("");
    process.exit(0);
  }

  if (args.includes("--watch") || args.includes("-w")) {
    log("Watching for changes...", colors.yellow);
    // TODO: Implement file watching
    logWarning("Watch mode not implemented yet");
  }

  main();
}

module.exports = {
  generateMetadata: main,
  CONFIG,
};
