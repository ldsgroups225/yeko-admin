import { generateId } from "@/lib/utils";

export function StudentsPerSchoolSkeleton({
  rows = 5,
}: {
  /** How many placeholder rows to render */
  rows?: number;
}) {
  return (
    <ul aria-hidden className="space-y-4">
      {Array.from({ length: rows }).map(() => (
        <li key={generateId()} className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted/40 animate-pulse" />

            <div className="min-w-0">
              <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
            </div>
          </div>

          <div className="text-right min-w-[56px]">
            <div className="h-4 w-12 rounded bg-muted/40 animate-pulse mx-auto" />
            <div className="h-3 w-16 rounded bg-muted/30 animate-pulse mt-1 mx-auto" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default StudentsPerSchoolSkeleton;
