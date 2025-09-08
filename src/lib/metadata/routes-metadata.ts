// Auto-generated routes metadata
// Generated on: 2025-09-08T19:44:53.610Z

import type { RouteMetadata } from "./metadata-types";

export const routes: RouteMetadata[] = [
  {
    path: "/(auth)/auth-code-error",
    file: "src/app/(auth)/auth-code-error/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(auth)/forgot-password",
    file: "src/app/(auth)/forgot-password/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(auth)/sign-in",
    file: "src/app/(auth)/sign-in/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/dashboard",
    file: "src/app/(protected)/dashboard/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/schools/:id",
    file: "src/app/(protected)/schools/[id]/page.tsx",
    type: "page",
    dynamic: true,
    params: [":id"],
  },
  {
    path: "/(protected)/schools/add",
    file: "src/app/(protected)/schools/add/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/schools/new",
    file: "src/app/(protected)/schools/new/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/schools",
    file: "src/app/(protected)/schools/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/settings",
    file: "src/app/(protected)/settings/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/users/:id/link",
    file: "src/app/(protected)/users/[id]/link/page.tsx",
    type: "page",
    dynamic: true,
    params: [":id"],
  },
  {
    path: "/(protected)/users/add",
    file: "src/app/(protected)/users/add/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/(protected)/users",
    file: "src/app/(protected)/users/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
  {
    path: "/",
    file: "src/app/page.tsx",
    type: "page",
    dynamic: false,
    params: [],
  },
];

export const apiRoutes: RouteMetadata[] = [
  {
    path: "/api/logs",
    file: "src/app/api/logs/route.ts",
    type: "api",
    dynamic: false,
    params: [],
  },
];

export const allRoutes: RouteMetadata[] = [...routes, ...apiRoutes];

export function findRoute(path: string): RouteMetadata | undefined {
  return allRoutes.find((route) => route.path === path);
}

export function findRoutesByType(type: "page" | "api"): RouteMetadata[] {
  return allRoutes.filter((route) => route.type === type);
}

export function findDynamicRoutes(): RouteMetadata[] {
  return allRoutes.filter((route) => route.dynamic);
}

export function getRouteParams(path: string): string[] {
  const route = findRoute(path);
  return route ? route.params : [];
}
