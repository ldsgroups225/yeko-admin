import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/metadata";

export async function GET() {
  const manifest = {
    name: siteConfig.name,
    short_name: "Yeko",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["education", "productivity", "business"],
    lang: "fr",
    dir: "ltr",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-1.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Dashboard Overview",
      },
      {
        src: "/screenshots/mobile-1.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Mobile Dashboard",
      },
    ],
    shortcuts: [
      {
        name: "Tableau de bord",
        short_name: "Dashboard",
        description: "Accéder au tableau de bord principal",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/dashboard-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Paramètres",
        short_name: "Settings",
        description: "Gérer vos paramètres",
        url: "/settings",
        icons: [
          {
            src: "/icons/settings-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
