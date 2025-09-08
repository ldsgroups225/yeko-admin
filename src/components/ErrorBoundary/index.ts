// Enhanced Error Boundary Components

// Types
export type { ErrorContext, ErrorMetadata } from "../../lib/error-logging";
// Re-export error logging utilities
export {
  EnhancedError,
  ErrorBoundaryUtils,
  ErrorFactory,
  setupGlobalErrorHandlers,
  useErrorBoundary,
} from "../../lib/error-logging";
// Re-export Sentry integration utilities
export {
  SentryUtils,
  sentryErrorBoundaryIntegration,
  useSentryErrorBoundary,
} from "../../lib/sentry-integration";
// Legacy Error Boundary (for backward compatibility)
export { default as ErrorBoundary } from "../ErrorBoundary";
export { default as EnhancedErrorBoundary } from "./EnhancedErrorBoundary";
export {
  ApiErrorBoundary,
  AuthErrorBoundary,
  ComponentErrorBoundary,
  DatabaseErrorBoundary,
  FormErrorBoundary,
  PageErrorBoundary,
  UserManagementErrorBoundary,
} from "./SpecializedErrorBoundaries";
