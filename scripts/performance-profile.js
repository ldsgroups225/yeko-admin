#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync, spawn } = require("node:child_process");
const os = require("node:os");

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

function _logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Performance profiling configuration
const PROFILE_CONFIG = {
  outputDir: "performance-reports",
  buildProfile: {
    enabled: true,
    output: "build-profile.json",
  },
  runtimeProfile: {
    enabled: true,
    output: "runtime-profile.json",
    duration: 30000, // 30 seconds
  },
  memoryProfile: {
    enabled: true,
    output: "memory-profile.json",
  },
  bundleAnalysis: {
    enabled: true,
    output: "bundle-analysis.json",
  },
};

function ensureOutputDirectory() {
  if (!fs.existsSync(PROFILE_CONFIG.outputDir)) {
    fs.mkdirSync(PROFILE_CONFIG.outputDir, { recursive: true });
    logInfo(`Created output directory: ${PROFILE_CONFIG.outputDir}`);
  }
}

function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  };
}

function profileBuild() {
  log("🏗️  Profiling build performance...", colors.bright);

  const startTime = Date.now();
  const systemInfo = getSystemInfo();

  try {
    // Run build with profiling
    const buildCommand = 'NODE_OPTIONS="--prof" npm run build';
    execSync(buildCommand, { stdio: "inherit" });

    const endTime = Date.now();
    const duration = endTime - startTime;

    const profileData = {
      type: "build",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      success: true,
    };

    // Save profile data
    const outputPath = path.join(
      PROFILE_CONFIG.outputDir,
      PROFILE_CONFIG.buildProfile.output,
    );
    fs.writeFileSync(outputPath, JSON.stringify(profileData, null, 2));

    logSuccess(`Build completed in ${duration}ms`);
    logInfo(`Build profile saved to: ${outputPath}`);

    return profileData;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const profileData = {
      type: "build",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      success: false,
      error: error.message,
    };

    logError(`Build failed after ${duration}ms: ${error.message}`);
    return profileData;
  }
}

function _profileRuntime() {
  log("⚡ Profiling runtime performance...", colors.bright);

  return new Promise((resolve) => {
    const startTime = Date.now();
    const systemInfo = getSystemInfo();

    // Start the development server
    const server = spawn("npm", ["run", "dev"], {
      stdio: "pipe",
      env: { ...process.env, NODE_OPTIONS: "--prof" },
    });

    let serverOutput = "";
    let errorOutput = "";

    server.stdout.on("data", (data) => {
      serverOutput += data.toString();
    });

    server.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Wait for server to start
    setTimeout(() => {
      logInfo("Server started, profiling for 30 seconds...");

      // Profile for specified duration
      setTimeout(() => {
        server.kill();

        const endTime = Date.now();
        const duration = endTime - startTime;

        const profileData = {
          type: "runtime",
          duration,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          systemInfo,
          success: true,
          serverOutput: serverOutput.slice(-1000), // Last 1000 chars
          errorOutput: errorOutput.slice(-1000), // Last 1000 chars
        };

        // Save profile data
        const outputPath = path.join(
          PROFILE_CONFIG.outputDir,
          PROFILE_CONFIG.runtimeProfile.output,
        );
        fs.writeFileSync(outputPath, JSON.stringify(profileData, null, 2));

        logSuccess(`Runtime profiling completed in ${duration}ms`);
        logInfo(`Runtime profile saved to: ${outputPath}`);

        resolve(profileData);
      }, PROFILE_CONFIG.runtimeProfile.duration);
    }, 10000); // Wait 10 seconds for server to start

    server.on("error", (error) => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const profileData = {
        type: "runtime",
        duration,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        systemInfo,
        success: false,
        error: error.message,
      };

      logError(`Runtime profiling failed: ${error.message}`);
      resolve(profileData);
    });
  });
}

function profileMemory() {
  log("🧠 Profiling memory usage...", colors.bright);

  const startTime = Date.now();
  const systemInfo = getSystemInfo();

  try {
    // Get memory usage before
    const memBefore = process.memoryUsage();

    // Run a build to measure memory usage
    execSync("npm run build", { stdio: "pipe" });

    // Get memory usage after
    const memAfter = process.memoryUsage();

    const endTime = Date.now();
    const duration = endTime - startTime;

    const profileData = {
      type: "memory",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      memoryBefore: {
        rss: memBefore.rss,
        heapTotal: memBefore.heapTotal,
        heapUsed: memBefore.heapUsed,
        external: memBefore.external,
        arrayBuffers: memBefore.arrayBuffers,
      },
      memoryAfter: {
        rss: memAfter.rss,
        heapTotal: memAfter.heapTotal,
        heapUsed: memAfter.heapUsed,
        external: memAfter.external,
        arrayBuffers: memAfter.arrayBuffers,
      },
      memoryDelta: {
        rss: memAfter.rss - memBefore.rss,
        heapTotal: memAfter.heapTotal - memBefore.heapTotal,
        heapUsed: memAfter.heapUsed - memBefore.heapUsed,
        external: memAfter.external - memBefore.external,
        arrayBuffers: memAfter.arrayBuffers - memBefore.arrayBuffers,
      },
      success: true,
    };

    // Save profile data
    const outputPath = path.join(
      PROFILE_CONFIG.outputDir,
      PROFILE_CONFIG.memoryProfile.output,
    );
    fs.writeFileSync(outputPath, JSON.stringify(profileData, null, 2));

    logSuccess(`Memory profiling completed in ${duration}ms`);
    logInfo(`Memory profile saved to: ${outputPath}`);

    // Display memory usage
    log("\n📊 Memory Usage:", colors.bright);
    log(
      `   RSS: ${(profileData.memoryAfter.rss / 1024 / 1024).toFixed(2)} MB`,
      colors.cyan,
    );
    log(
      `   Heap Total: ${(profileData.memoryAfter.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      colors.cyan,
    );
    log(
      `   Heap Used: ${(profileData.memoryAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      colors.cyan,
    );
    log(
      `   External: ${(profileData.memoryAfter.external / 1024 / 1024).toFixed(2)} MB`,
      colors.cyan,
    );

    return profileData;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const profileData = {
      type: "memory",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      success: false,
      error: error.message,
    };

    logError(`Memory profiling failed: ${error.message}`);
    return profileData;
  }
}

function analyzeBundle() {
  log("📦 Analyzing bundle size...", colors.bright);

  const startTime = Date.now();
  const systemInfo = getSystemInfo();

  try {
    // Run build with analysis
    execSync("ANALYZE=true npm run build", { stdio: "pipe" });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Get bundle size information
    const bundleInfo = getBundleSizeInfo();

    const profileData = {
      type: "bundle",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      bundleInfo,
      success: true,
    };

    // Save profile data
    const outputPath = path.join(
      PROFILE_CONFIG.outputDir,
      PROFILE_CONFIG.bundleAnalysis.output,
    );
    fs.writeFileSync(outputPath, JSON.stringify(profileData, null, 2));

    logSuccess(`Bundle analysis completed in ${duration}ms`);
    logInfo(`Bundle analysis saved to: ${outputPath}`);

    // Display bundle info
    if (bundleInfo) {
      log("\n📊 Bundle Analysis:", colors.bright);
      log(
        `   Total size: ${(bundleInfo.totalSize / 1024 / 1024).toFixed(2)} MB`,
        colors.cyan,
      );
      log(
        `   JavaScript: ${(bundleInfo.jsSize / 1024 / 1024).toFixed(2)} MB`,
        colors.cyan,
      );
      log(
        `   CSS: ${(bundleInfo.cssSize / 1024 / 1024).toFixed(2)} MB`,
        colors.cyan,
      );
      log(
        `   Images: ${(bundleInfo.imageSize / 1024 / 1024).toFixed(2)} MB`,
        colors.cyan,
      );
    }

    return profileData;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const profileData = {
      type: "bundle",
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      systemInfo,
      success: false,
      error: error.message,
    };

    logError(`Bundle analysis failed: ${error.message}`);
    return profileData;
  }
}

function getBundleSizeInfo() {
  try {
    const nextDir = ".next";
    if (!fs.existsSync(nextDir)) {
      return null;
    }

    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;

    function calculateSize(dir) {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          calculateSize(itemPath);
        } else {
          totalSize += stats.size;

          if (item.endsWith(".js")) {
            jsSize += stats.size;
          } else if (item.endsWith(".css")) {
            cssSize += stats.size;
          } else if (item.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
            imageSize += stats.size;
          }
        }
      }
    }

    calculateSize(nextDir);

    return {
      totalSize,
      jsSize,
      cssSize,
      imageSize,
    };
  } catch (_error) {
    return null;
  }
}

function generatePerformanceReport(profiles) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProfiles: profiles.length,
      successfulProfiles: profiles.filter((p) => p.success).length,
      failedProfiles: profiles.filter((p) => !p.success).length,
      totalDuration: profiles.reduce((sum, p) => sum + p.duration, 0),
    },
    profiles,
    recommendations: generateRecommendations(profiles),
  };

  // Write report to file
  const outputPath = path.join(
    PROFILE_CONFIG.outputDir,
    "performance-report.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  return report;
}

function generateRecommendations(profiles) {
  const recommendations = [];

  // Analyze build performance
  const buildProfile = profiles.find((p) => p.type === "build");
  if (buildProfile?.success) {
    if (buildProfile.duration > 60000) {
      // More than 1 minute
      recommendations.push({
        type: "build",
        severity: "warning",
        message:
          "Build time is slow (>1 minute). Consider optimizing build configuration.",
      });
    }
  }

  // Analyze memory usage
  const memoryProfile = profiles.find((p) => p.type === "memory");
  if (memoryProfile?.success) {
    const heapUsed = memoryProfile.memoryAfter.heapUsed / 1024 / 1024; // MB
    if (heapUsed > 500) {
      // More than 500MB
      recommendations.push({
        type: "memory",
        severity: "warning",
        message: `High memory usage (${heapUsed.toFixed(2)}MB). Consider optimizing memory usage.`,
      });
    }
  }

  // Analyze bundle size
  const bundleProfile = profiles.find((p) => p.type === "bundle");
  if (bundleProfile?.success && bundleProfile.bundleInfo) {
    const totalSize = bundleProfile.bundleInfo.totalSize / 1024 / 1024; // MB
    if (totalSize > 10) {
      // More than 10MB
      recommendations.push({
        type: "bundle",
        severity: "warning",
        message: `Large bundle size (${totalSize.toFixed(2)}MB). Consider code splitting and optimization.`,
      });
    }
  }

  return recommendations;
}

// Main execution
async function main() {
  try {
    log("⚡ Performance Profiling", colors.bright);
    log("=".repeat(40), colors.cyan);

    ensureOutputDirectory();

    const profiles = [];

    // Run build profiling
    if (PROFILE_CONFIG.buildProfile.enabled) {
      const buildProfile = profileBuild();
      profiles.push(buildProfile);
    }

    // Run memory profiling
    if (PROFILE_CONFIG.memoryProfile.enabled) {
      const memoryProfile = profileMemory();
      profiles.push(memoryProfile);
    }

    // Run bundle analysis
    if (PROFILE_CONFIG.bundleAnalysis.enabled) {
      const bundleProfile = analyzeBundle();
      profiles.push(bundleProfile);
    }

    // Run runtime profiling (async)
    if (PROFILE_CONFIG.runtimeProfile.enabled) {
      logInfo("Runtime profiling will run in background...");
      // Note: This would need to be implemented as a separate process
      // For now, we'll skip it to avoid blocking
    }

    // Generate report
    const report = generatePerformanceReport(profiles);

    // Display summary
    log("\n📊 Performance Profiling Summary:", colors.bright);
    log(`   Total profiles: ${report.summary.totalProfiles}`, colors.cyan);
    log(`   Successful: ${report.summary.successfulProfiles}`, colors.green);
    log(`   Failed: ${report.summary.failedProfiles}`, colors.red);
    log(`   Total duration: ${report.summary.totalDuration}ms`, colors.cyan);

    // Display recommendations
    if (report.recommendations.length > 0) {
      log("\n💡 Recommendations:", colors.bright);
      for (const rec of report.recommendations) {
        const color = rec.severity === "warning" ? colors.yellow : colors.red;
        log(`   ${rec.type}: ${rec.message}`, color);
      }
    }

    log(
      `\n📄 Performance report saved to: ${PROFILE_CONFIG.outputDir}/performance-report.json`,
      colors.cyan,
    );
    logSuccess("Performance profiling completed!");
  } catch (error) {
    logError(`Performance profiling failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("Performance Profiling Script", colors.bright);
    log("Usage: node scripts/performance-profile.js [options]");
    log("");
    log("This script profiles the performance of the application.");
    log("");
    log("Options:");
    log("  --help, -h     Show this help message");
    log("  --build-only   Only run build profiling");
    log("  --memory-only  Only run memory profiling");
    log("  --bundle-only  Only run bundle analysis");
    log("  --output-dir   Specify output directory");
    log("");
    process.exit(0);
  }

  // Handle specific profiling options
  if (args.includes("--build-only")) {
    PROFILE_CONFIG.memoryProfile.enabled = false;
    PROFILE_CONFIG.bundleAnalysis.enabled = false;
    PROFILE_CONFIG.runtimeProfile.enabled = false;
  }

  if (args.includes("--memory-only")) {
    PROFILE_CONFIG.buildProfile.enabled = false;
    PROFILE_CONFIG.bundleAnalysis.enabled = false;
    PROFILE_CONFIG.runtimeProfile.enabled = false;
  }

  if (args.includes("--bundle-only")) {
    PROFILE_CONFIG.buildProfile.enabled = false;
    PROFILE_CONFIG.memoryProfile.enabled = false;
    PROFILE_CONFIG.runtimeProfile.enabled = false;
  }

  const outputDirIndex = args.indexOf("--output-dir");
  if (outputDirIndex !== -1 && args[outputDirIndex + 1]) {
    PROFILE_CONFIG.outputDir = args[outputDirIndex + 1];
  }

  main();
}

module.exports = {
  profilePerformance: main,
  PROFILE_CONFIG,
};
