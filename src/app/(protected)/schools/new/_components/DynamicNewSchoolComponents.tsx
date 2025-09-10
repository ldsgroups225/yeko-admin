import dynamic from "next/dynamic";
import { NewSchoolFormSkeleton } from "./NewSchoolFormSkeleton";

// Dynamic imports with loading fallbacks
export const NewSchoolForm = dynamic(
  () =>
    import("./NewSchoolForm").then((mod) => ({
      default: mod.NewSchoolForm,
    })),
  {
    loading: () => <NewSchoolFormSkeleton />,
    ssr: true,
  },
);
