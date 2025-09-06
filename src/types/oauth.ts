import type { Profile } from "./profile";

/**
 * Represents the supported OAuth providers
 */
export type OAuthProvider = "google" | "facebook" | "github";

/**
 * OAuth authentication options
 */
export interface OAuthOptions {
  /** OAuth provider to use */
  provider: OAuthProvider;
  /** Redirect URL after authentication */
  redirectTo?: string;
  /** Additional scopes to request */
  scopes?: string[];
}

/**
 * Extended user profile with OAuth information
 */
export interface IUserProfileWithOAuth extends Profile {
  /** OAuth provider information */
  oauthProvider?: OAuthProvider;
  /** OAuth profile picture URL */
  oauthAvatarUrl?: string;
  /** Whether account was created via OAuth */
  isOAuthAccount?: boolean;
}

/**
 * OAuth error types
 */
export interface OAuthError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * OAuth state for authentication flow
 */
export interface OAuthState {
  /** Whether OAuth flow is in progress */
  isLoading: boolean;
  /** Current error if any */
  error: OAuthError | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user profile */
  user: IUserProfileWithOAuth | null;
}

/**
 * OAuth authentication result
 */
export interface OAuthResult {
  /** Whether authentication was successful */
  success: boolean;
  /** User profile data if successful */
  user?: Profile;
  /** Error message if failed */
  error?: string;
  /** Whether this was a new user registration */
  isNewUser?: boolean;
}

export interface GoogleProfile {
  /** Google user ID */
  sub: string;
  /** User's email address */
  email: string;
  /** User's full name */
  name: string;
  /** URL to user's profile picture */
  picture: string;
  /** User's given/first name */
  given_name: string;
  /** User's family/last name */
  family_name: string;
  /** Whether email has been verified by Google */
  email_verified: boolean;
  /** User's locale */
  locale?: string;
}
