// Auto-generated metadata types
// Generated on: 2025-09-08T21:13:33.254Z

export interface RouteMetadata {
  path: string;
  file: string;
  type: "page" | "api";
  dynamic: boolean;
  params: string[];
}

export interface ComponentMetadata {
  name: string;
  file: string;
  props: string[];
  imports: string[];
  size: number;
  lastModified: Date;
}

export interface ProjectMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  dependencies: string[];
  devDependencies: string[];
  git: {
    branch: string;
    commit: string;
    shortCommit: string;
    lastCommit: string;
    timestamp: string;
  };
  build: {
    timestamp: string;
    environment: string;
    nodeVersion: string;
  };
  stats: {
    totalFiles: number;
    totalRoutes: number;
    totalApiRoutes: number;
    totalComponents: number;
    totalSize: number;
  };
}

export interface FileMetadata {
  path: string;
  relativePath: string;
  name: string;
  extension: string;
  stats: {
    size: number;
    modified: Date;
    created: Date;
  } | null;
}
