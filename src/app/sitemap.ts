import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static routes that are publicly accessible
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Protected routes that should be included for SEO but require authentication
  const protectedRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schools/add`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/schools/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/users`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/users/add`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic routes could be added here in the future
  // For example, if we want to include specific school or user pages:
  // const dynamicRoutes = await generateDynamicRoutes(baseUrl)

  return [...staticRoutes, ...protectedRoutes];
}

/**
 * Helper function for future dynamic route generation
 *
 * To add dynamic routes (e.g., individual school or user pages):
 * 1. Uncomment this function
 * 2. Import your data service (e.g., from '../services/dataService')
 * 3. Fetch the data and map to sitemap entries
 * 4. Call this function in the main sitemap function
 *
 * Example usage:
 * const dynamicRoutes = await generateDynamicRoutes(baseUrl)
 * return [...staticRoutes, ...protectedRoutes, ...dynamicRoutes]
 */
// async function generateDynamicRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
//   try {
//     // Example: Fetch schools from database
//     // const { getPublicSchools } = await import('../services/dataService')
//     // const schools = await getPublicSchools()
//     // const schoolRoutes = schools.map(school => ({
//     //   url: `${baseUrl}/schools/${school.id}`,
//     //   lastModified: new Date(school.updatedAt),
//     //   changeFrequency: 'weekly' as const,
//     //   priority: 0.7,
//     // }))
//     // return schoolRoutes
//     return []
//   } catch (error) {
//     console.error('Error generating dynamic sitemap routes:', error)
//     return []
//   }
// }
