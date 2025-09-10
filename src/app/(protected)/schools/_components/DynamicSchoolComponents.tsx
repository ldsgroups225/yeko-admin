import dynamic from "next/dynamic";
import { SchoolFiltersSkeleton } from "./SchoolFiltersSkeleton";
import { SchoolStatCardsSkeleton } from "./SchoolStatCardsSkeleton";
import { SchoolsListSkeleton } from "./SchoolsListSkeleton";

// Dynamic imports with loading fallbacks
export const SchoolStatCards = dynamic(
  () =>
    import("./SchoolStatCards").then((mod) => ({
      default: mod.SchoolStatCards,
    })),
  {
    loading: () => <SchoolStatCardsSkeleton />,
    ssr: true,
  },
);

export const SchoolsList = dynamic(
  () =>
    import("./SchoolsList").then((mod) => ({
      default: mod.SchoolsList,
    })),
  {
    loading: () => <SchoolsListSkeleton />,
    ssr: true,
  },
);

export const SchoolFilters = dynamic(
  () =>
    import("./SchoolFilters").then((mod) => ({
      default: mod.SchoolFilters,
    })),
  {
    loading: () => <SchoolFiltersSkeleton />,
    ssr: true,
  },
);
