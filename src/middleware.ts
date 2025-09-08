import type { NextRequest } from "next/server";
import { loggers } from "@/lib/logger";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const startTime = Date.now();

  // Log the incoming request
  loggers.api.request(request.method, request.nextUrl.pathname, {
    userAgent: request.headers.get("user-agent"),
    ip:
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown",
    url: request.url,
  });

  try {
    const response = await updateSession(request);

    // Log the response
    const duration = Date.now() - startTime;
    loggers.api.response(
      request.method,
      request.nextUrl.pathname,
      response.status,
      duration,
      {
        userAgent: request.headers.get("user-agent"),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
      },
    );

    return response;
  } catch (error) {
    // Log any middleware errors
    const duration = Date.now() - startTime;
    loggers.api.error(
      request.method,
      request.nextUrl.pathname,
      error as Error,
      {
        userAgent: request.headers.get("user-agent"),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        duration,
      },
    );
    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
