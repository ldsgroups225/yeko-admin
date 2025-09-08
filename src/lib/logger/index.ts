// Re-export everything from the main logger file
export * from "../logger";

// Initialize logger on import
import { configureLogger } from "../logger";

// Auto-configure logger when this module is imported
let isConfigured = false;

export async function initializeLogger() {
  if (!isConfigured) {
    await configureLogger();
    isConfigured = true;
  }
}

// Auto-initialize in non-test environments
if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
  initializeLogger().catch(console.error);
}
