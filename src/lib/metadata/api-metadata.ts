// Auto-generated API metadata
// Generated on: 2025-09-10T15:14:35.617Z

import type { RouteMetadata } from "./metadata-types";

export const apiEndpoints: RouteMetadata[] = [
  {
    path: "/api/logs",
    file: "src/app/api/logs/route.ts",
    type: "api",
    dynamic: false,
    params: [],
  },
];

export function getApiEndpoints(): RouteMetadata[] {
  return apiEndpoints;
}

export function findApiEndpoint(path: string): RouteMetadata | undefined {
  return apiEndpoints.find((endpoint) => endpoint.path === path);
}

export function getApiEndpointsByMethod(_method: string): RouteMetadata[] {
  // This would need to be enhanced to parse actual HTTP methods from route files
  return apiEndpoints;
}

export function getDynamicApiEndpoints(): RouteMetadata[] {
  return apiEndpoints.filter((endpoint) => endpoint.dynamic);
}

export function getApiEndpointParams(path: string): string[] {
  const endpoint = findApiEndpoint(path);
  return endpoint ? endpoint.params : [];
}
