import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Font loading for better typography (with fallback)
const interSemiBold = fetch(
  new URL("../../../assets/fonts/Inter-SemiBold.ttf", import.meta.url),
)
  .then((res) => res.arrayBuffer())
  .catch(() => null);

const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url),
)
  .then((res) => res.arrayBuffer())
  .catch(() => null);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get("title") || "Yeko Admin";
    const description =
      searchParams.get("description") ||
      "Plateforme éducative de gestion scolaire";
    const type = searchParams.get("type") || "website";
    const width = parseInt(searchParams.get("width") || "1200", 10);
    const height = parseInt(searchParams.get("height") || "630", 10);

    // Load fonts (with fallback)
    const [interSemiBoldData, interRegularData] = await Promise.all([
      interSemiBold,
      interRegular,
    ]);

    // Prepare fonts array (only include fonts that loaded successfully)
    const fonts: Array<{
      name: string;
      data: ArrayBuffer;
      style: "normal";
      weight: 400 | 600;
    }> = [];
    if (interSemiBoldData) {
      fonts.push({
        name: "Inter",
        data: interSemiBoldData,
        style: "normal" as const,
        weight: 600 as const,
      });
    }
    if (interRegularData) {
      fonts.push({
        name: "Inter",
        data: interRegularData,
        style: "normal" as const,
        weight: 400 as const,
      });
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a", // slate-900
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          position: "relative",
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
          }}
        />

        {/* Logo/Brand area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#3b82f6", // blue-500
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              Y
            </div>
          </div>
          <div
            style={{
              color: "#f1f5f9", // slate-100
              fontSize: "32px",
              fontWeight: "600",
              fontFamily: "Inter",
            }}
          >
            Yeko Admin
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 60px",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 50 ? "48px" : "64px",
              fontWeight: "600",
              color: "#f8fafc", // slate-50
              lineHeight: "1.1",
              marginBottom: "24px",
              fontFamily: "Inter",
              textAlign: "center",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: "24px",
                color: "#cbd5e1", // slate-400
                lineHeight: "1.4",
                fontFamily: "Inter",
                textAlign: "center",
                maxWidth: "700px",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Type indicator */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            backgroundColor: "rgba(59, 130, 246, 0.2)", // blue-500 with opacity
            color: "#93c5fd", // blue-300
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "16px",
            fontFamily: "Inter",
            textTransform: "capitalize",
          }}
        >
          {type}
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
          }}
        />
      </div>,
      {
        width,
        height,
        fonts: fonts.length > 0 ? fonts : undefined,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback response
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          fontSize: "48px",
          fontWeight: "600",
        }}
      >
        Yeko Admin
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
