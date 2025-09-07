import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/utils/env";
import type { Database } from "./types";

// Configuration interface for route definitions
interface RouteConfig {
  publicPaths: string[];
  protectedPaths: string[]; // Admin-only routes
  authRequiredPaths: string[]; // Authenticated user routes
  authPages: string[];
  defaultRedirect: string;
}

// Default configuration based on actual project routes
const DEFAULT_ROUTES: RouteConfig = {
  publicPaths: [
    "/",
    "/sign-in",
    "/forgot-password",
    "/auth/callback",
    "/auth/auth-code-error",
    "/forbidden",
  ],
  protectedPaths: ["/dashboard", "/schools", "/users"],
  authRequiredPaths: ["/dashboard", "/schools", "/users"],
  authPages: ["/sign-in", "/forgot-password"],
  defaultRedirect: "/dashboard",
};

/**
 * Check if path matches any route patterns
 */
function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname.startsWith(path));
}

/**
 * Create redirect response while preserving cookies
 */
function createRedirect(
  request: NextRequest,
  supabaseResponse: NextResponse,
  redirectPath: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = redirectPath;
  const redirectResponse = NextResponse.redirect(url);

  // Preserve cookies from supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return redirectResponse;
}

/**
 * Check admin role access - middleware compatible version
 */
async function hasAdminAccess(userId: string): Promise<boolean> {
  try {
    const { hasRole } = await import("../../services/userService");
    const { ERole } = await import("../../types");
    return await hasRole(userId, ERole.SUPER_ADMIN);
  } catch (error) {
    console.error("Admin access check error:", error);
    return false;
  }
}

/**
 * Main authentication logic
 */
async function handleAuthentication(
  request: NextRequest,
  supabaseResponse: NextResponse,
  userId: string,
  routes: RouteConfig,
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Handle unauthenticated users
  if (!userId) {
    const requiresAuth =
      matchesPath(pathname, routes.authRequiredPaths) ||
      matchesPath(pathname, routes.protectedPaths);

    return requiresAuth
      ? createRedirect(request, supabaseResponse, "/sign-in")
      : supabaseResponse;
  }

  // Handle authenticated users

  // Redirect away from auth pages
  if (matchesPath(pathname, routes.authPages)) {
    return createRedirect(request, supabaseResponse, routes.defaultRedirect);
  }

  // Check protected routes (admin-only)
  if (matchesPath(pathname, routes.protectedPaths)) {
    const hasAccess = await hasAdminAccess(userId);
    if (!hasAccess) {
      return createRedirect(request, supabaseResponse, "/forbidden");
    }
  }

  return supabaseResponse;
}

/**
 * Main middleware function
 */
export async function updateSession(
  request: NextRequest,
  routeConfig?: Partial<RouteConfig>,
) {
  const routes = { ...DEFAULT_ROUTES, ...routeConfig };

  // Initialize Supabase client
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle authentication logic
  try {
    return await handleAuthentication(
      request,
      supabaseResponse,
      user?.id || "",
      routes,
    );
  } catch (error) {
    console.error("Middleware authentication error:", error);

    // Fallback: redirect to forbidden if on protected route
    const pathname = request.nextUrl.pathname;
    if (matchesPath(pathname, routes.protectedPaths)) {
      return createRedirect(request, supabaseResponse, "/forbidden");
    }

    return supabaseResponse;
  }
}

// Export with default configuration
export const middleware = updateSession;

// Export configuration for Next.js middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// Export utility functions for reusability
export {
  type RouteConfig,
  DEFAULT_ROUTES,
  matchesPath,
  createRedirect,
  hasAdminAccess,
};
