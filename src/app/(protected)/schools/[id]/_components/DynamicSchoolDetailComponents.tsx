import dynamic from "next/dynamic";
import { SchoolDetailInfoSkeleton } from "./SchoolDetailInfoSkeleton";
import { SchoolStudentsListSkeleton } from "./SchoolStudentsListSkeleton";

// Dynamic imports with loading fallbacks
export const SchoolDetailInfo = dynamic(
  () =>
    import("./SchoolDetailInfo").then((mod) => ({
      default: mod.SchoolDetailInfo,
    })),
  {
    loading: () => <SchoolDetailInfoSkeleton />,
    ssr: true,
  },
);

export const SchoolStudentsList = dynamic(
  () =>
    import("./SchoolStudentsList").then((mod) => ({
      default: mod.SchoolStudentsList,
    })),
  {
    loading: () => <SchoolStudentsListSkeleton />,
    ssr: true,
  },
);
