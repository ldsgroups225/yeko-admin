// Auto-generated project metadata
// Generated on: 2025-09-08T20:25:46.725Z

import type { ProjectMetadata } from "./metadata-types";

export const projectMetadata: ProjectMetadata = {
  name: "yeko-admin",
  version: "0.1.0",
  description: undefined,
  author: undefined,
  license: undefined,
  dependencies: [
    "@hookform/resolvers",
    "@logtape/logtape",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-label",
    "@radix-ui/react-menubar",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-tooltip",
    "@sentry/nextjs",
    "@supabase/ssr",
    "@supabase/supabase-js",
    "class-variance-authority",
    "clsx",
    "cmdk",
    "date-fns",
    "embla-carousel-react",
    "input-otp",
    "lucide-react",
    "motion",
    "next",
    "next-themes",
    "react",
    "react-day-picker",
    "react-dom",
    "react-hook-form",
    "react-resizable-panels",
    "recharts",
    "sonner",
    "tailwind-merge",
    "vaul",
  ],
  devDependencies: [
    "@biomejs/biome",
    "@chromatic-com/playwright",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@commitlint/prompt-cli",
    "@lhci/cli",
    "@next/bundle-analyzer",
    "@playwright/test",
    "@spotlightjs/spotlight",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@storybook/nextjs-vite",
    "@storybook/test",
    "@t3-oss/env-nextjs",
    "@tailwindcss/postcss",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "@vitejs/plugin-react",
    "@vitest/browser",
    "@vitest/coverage-v8",
    "checkly",
    "chromatic",
    "commitizen",
    "conventional-changelog-conventionalcommits",
    "cross-env",
    "cz-conventional-changelog",
    "dotenv-cli",
    "knip",
    "lefthook",
    "lint-staged",
    "storybook",
    "tailwindcss",
    "tw-animate-css",
    "typescript",
    "vitest",
    "vitest-browser-react",
    "zod",
  ],
  git: {
    branch: "main",
    commit: "e82ffc57b6bb2f59fbc296bd16882dedb3ad478c",
    shortCommit: "e82ffc5",
    lastCommit:
      "e82ffc5 chore: update CI workflows and scripts for improved validation and error handling",
    timestamp: "2025-09-08T20:25:46.674Z",
  },
  build: {
    timestamp: "2025-09-08T20:25:46.725Z",
    environment: "development",
    nodeVersion: "v20.18.1",
  },
  stats: {
    totalFiles: 165,
    totalRoutes: 13,
    totalApiRoutes: 1,
    totalComponents: 59,
    totalSize: 820850,
  },
};

export function getProjectInfo(): ProjectMetadata {
  return projectMetadata;
}

export function getBuildInfo() {
  return projectMetadata.build;
}

export function getGitInfo() {
  return projectMetadata.git;
}

export function getProjectStats() {
  return projectMetadata.stats;
}

export function getDependencies() {
  return {
    dependencies: projectMetadata.dependencies,
    devDependencies: projectMetadata.devDependencies,
  };
}
