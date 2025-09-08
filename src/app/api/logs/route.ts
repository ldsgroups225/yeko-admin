import { type NextRequest, NextResponse } from "next/server";
import { loggers } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();

    // Validate the log entry
    if (!logEntry.level || !logEntry.message || !logEntry.category) {
      return NextResponse.json(
        { error: "Invalid log entry format" },
        { status: 400 },
      );
    }

    // Add server-side context
    const serverLogEntry = {
      ...logEntry,
      source: "client",
      serverTimestamp: new Date().toISOString(),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent"),
    };

    // Route to appropriate logger based on category
    const category = logEntry.category.split(".")[0];

    switch (category) {
      case "ui":
        loggers.ui.interaction(
          logEntry.category,
          logEntry.message,
          serverLogEntry,
        );
        break;
      case "auth":
        if (logEntry.level === "error" || logEntry.level === "warn") {
          loggers.auth.loginFailed(
            logEntry.properties?.email || "unknown",
            logEntry.message,
            serverLogEntry,
          );
        } else {
          loggers.auth.login(
            logEntry.properties?.userId || "unknown",
            serverLogEntry,
          );
        }
        break;
      case "api":
        if (logEntry.level === "error") {
          loggers.api.error(
            logEntry.properties?.method || "UNKNOWN",
            logEntry.properties?.url || "unknown",
            new Error(logEntry.message),
            serverLogEntry,
          );
        } else {
          loggers.api.request(
            logEntry.properties?.method || "UNKNOWN",
            logEntry.properties?.url || "unknown",
            serverLogEntry,
          );
        }
        break;
      default:
        // Generic application log
        switch (logEntry.level) {
          case "error":
            loggers.app.error(new Error(logEntry.message), serverLogEntry);
            break;
          case "warn":
            loggers.app.startup(serverLogEntry); // Using startup as generic warn
            break;
          default:
            loggers.app.startup(serverLogEntry); // Using startup as generic info
        }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing client log:", error);
    return NextResponse.json(
      { error: "Failed to process log entry" },
      { status: 500 },
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
