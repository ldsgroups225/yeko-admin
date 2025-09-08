import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/sign-in",
          "/forgot-password",
          "/dashboard",
          "/schools",
          "/users",
          "/settings",
        ],
        disallow: [
          "/api/",
          "/callback",
          "/auth-code-error",
          "/_next/",
          "/node_modules/",
          "/.git/",
          "/.env*",
          "/package.json",
          "/tsconfig.json",
          "/next.config.*",
          "/tailwind.config.*",
          "/postcss.config.*",
          "/biome.json",
          "/lefthook.yml",
          "/playwright.config.*",
          "/vitest.config.*",
          "/checkly.config.*",
          "/commitlint.config.*",
          "/knip.config.*",
          "/lint-staged.config.*",
          "/.storybook/",
          "/storybook-static/",
        ],
      },
      // Specific rules for search engine bots
      {
        userAgent: "Googlebot",
        allow: ["/", "/sign-in", "/forgot-password"],
        disallow: [
          "/api/",
          "/callback",
          "/auth-code-error",
          "/dashboard",
          "/schools",
          "/users",
          "/settings",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/sign-in", "/forgot-password"],
        disallow: [
          "/api/",
          "/callback",
          "/auth-code-error",
          "/dashboard",
          "/schools",
          "/users",
          "/settings",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
