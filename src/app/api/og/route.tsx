import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get("title") || "Yeko Admin";
    const description =
      searchParams.get("description") ||
      "Plateforme éducative de gestion scolaire";
    const type = searchParams.get("type") || "website";

    // Create a simple SVG-based OG image
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bg)"/>
        
        <!-- Pattern overlay -->
        <defs>
          <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="2" fill="#1e293b" opacity="0.3"/>
            <circle cx="75" cy="75" r="2" fill="#1e293b" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#dots)"/>
        
        <!-- Logo -->
        <rect x="520" y="200" width="60" height="60" rx="12" fill="#3b82f6"/>
        <text x="550" y="240" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="32" font-weight="bold">Y</text>
        
        <!-- Brand name -->
        <text x="600" y="240" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="32" font-weight="600">Yeko Admin</text>
        
        <!-- Title -->
        <text x="600" y="320" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="${title.length > 50 ? "48" : "64"}" font-weight="600">
          ${title.length > 50 ? `${title.substring(0, 47)}...` : title}
        </text>
        
        <!-- Description -->
        ${
          description
            ? `
          <text x="600" y="380" text-anchor="middle" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="24">
            ${description.length > 60 ? `${description.substring(0, 57)}...` : description}
          </text>
        `
            : ""
        }
        
        <!-- Type indicator -->
        <rect x="1000" y="40" width="100" height="30" rx="15" fill="rgba(59, 130, 246, 0.2)"/>
        <text x="1050" y="60" text-anchor="middle" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="16" text-transform="capitalize">${type}</text>
        
        <!-- Bottom accent -->
        <rect x="0" y="626" width="1200" height="4" fill="url(#accent)"/>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback SVG
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0f172a"/>
        <text x="600" y="315" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="48" font-weight="600">Yeko Admin</text>
      </svg>
    `;

    return new Response(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }
}
