import dynamic from "next/dynamic";
import { DashboardStatCardsSkeleton } from "./DashboardStatCardsSkeleton";
import { RecentSchoolSkeleton } from "./RecentSchoolsSkeleton";
import { StudentsPerSchoolSkeleton } from "./StudentsPerSchoolSkeleton";

// Dynamic imports with loading fallbacks
export const DashboardStatCards = dynamic(
  () =>
    import("./DashboardStatCards").then((mod) => ({
      default: mod.DashboardStatCards,
    })),
  {
    loading: () => <DashboardStatCardsSkeleton />,
    ssr: true,
  },
);

export const RecentSchool = dynamic(
  () =>
    import("./RecentSchools").then((mod) => ({ default: mod.RecentSchool })),
  {
    loading: () => <RecentSchoolSkeleton />,
    ssr: true,
  },
);

export const StudentsPerSchool = dynamic(
  () =>
    import("./StudentsPerSchool").then((mod) => ({
      default: mod.StudentsPerSchool,
    })),
  {
    loading: () => <StudentsPerSchoolSkeleton />,
    ssr: true,
  },
);
