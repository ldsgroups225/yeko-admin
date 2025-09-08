/**
 * Lighthouse CI Configuration
 *
 * This is the main configuration file for Lighthouse CI.
 * It references the specific config files for different environments.
 */

module.exports = {
  ci: {
    collect: {
      // Use the development config by default
      // Override for mobile testing
      config: {
        desktop: "./lighthouse.config.js",
        mobile: "./lighthouse.mobile.config.js",
      },
    },
    assert: {
      // Use assertions from the specific config files
      config: "./lighthouse.config.js",
    },
    upload: {
      // Upload to Lighthouse CI server (when configured)
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
    server: {
      // Local server configuration
      port: 9001,
      storage: {
        storageMethod: "sql",
        sqlDialect: "sqlite",
        sqlDatabasePath: ".lighthouseci/db.sql",
      },
    },
  },
};
