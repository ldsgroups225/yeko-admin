import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    "src/app/forbidden.tsx", // Error page - may be used by middleware
    "src/app/unauthorized.tsx", // Error page - may be used by middleware
    "src/actions/classes.ts", // Future feature
    "src/actions/students.ts", // Future feature
    "src/components/Combobox.tsx", // Future feature
    "src/components/GoogleSignInButton.tsx", // Future feature
    "src/hooks/useEntityActions.ts", // Future feature
    "src/hooks/useGoogleAuth.ts", // Future feature
    "src/hooks/useOptimisticAction.ts", // Future feature
    "src/hooks/useServerAction.ts", // Future feature
    "src/services/index.ts", // Barrel export
    "src/app/(protected)/dashboard/_components/index.ts", // Barrel export
    // UI component library files (shadcn/ui components)
    "src/components/ui/accordion.tsx",
    "src/components/ui/alert-dialog.tsx",
    "src/components/ui/aspect-ratio.tsx",
    "src/components/ui/avatar.tsx",
    "src/components/ui/breadcrumb.tsx",
    "src/components/ui/calendar.tsx",
    "src/components/ui/carousel.tsx",
    "src/components/ui/chart.tsx",
    "src/components/ui/collapsible.tsx",
    "src/components/ui/context-menu.tsx",
    "src/components/ui/drawer.tsx",
    "src/components/ui/dropdown-menu.tsx",
    "src/components/ui/form.tsx",
    "src/components/ui/hover-card.tsx",
    "src/components/ui/input-otp.tsx",
    "src/components/ui/menubar.tsx",
    "src/components/ui/navigation-menu.tsx",
    "src/components/ui/pagination.tsx",
    "src/components/ui/popover.tsx",
    "src/components/ui/progress.tsx",
    "src/components/ui/radio-group.tsx",
    "src/components/ui/resizable.tsx",
    "src/components/ui/scroll-area.tsx",
    "src/components/ui/slider.tsx",
    "src/components/ui/sonner.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/toggle-group.tsx",
    "src/components/ui/toggle.tsx",
  ],
  // Dependencies to ignore during analysis (actually unused but kept for future features)
  ignoreDependencies: [
    "@hookform/resolvers", // Form validation - future feature
    "react-hook-form", // Form handling - future feature
    "embla-carousel-react", // Carousel - future feature
    "input-otp", // OTP input - future feature
    "react-day-picker", // Date picker - future feature
    "react-resizable-panels", // Resizable panels - future feature
    "vaul", // Drawer component - future feature
    "next-themes", // Theme provider - used in sonner component
    "recharts", // Charts - used in chart components
    "tailwindcss", // CSS framework - used in build process
    "tw-animate-css", // Animation utilities - used in globals.css
    // Unused Radix UI components (kept for future features)
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-avatar",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-menubar",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-slider",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join("\n"),
  },
  // Project configuration
  project: ["src/**/*.{ts,tsx}", "components.json"],
  // Entry files
  entry: [
    "src/app/**/page.tsx",
    "src/app/**/layout.tsx",
    "src/app/**/route.ts",
  ],
};

export default config;
