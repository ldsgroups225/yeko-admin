import { generateId } from "@/lib/utils";

export function RecentSchoolSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul aria-hidden className="space-y-4">
      {Array.from({ length: rows }).map(() => (
        <li
          key={generateId()}
          className="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div className="flex-1 min-w-0">
            <div className="h-4 w-3/5 rounded bg-muted/40 animate-pulse mb-2" />
            <div className="h-3 w-1/2 rounded bg-muted/30 animate-pulse" />
          </div>

          <div className="ml-4 flex-shrink-0">
            <div className="h-6 w-20 rounded-full bg-muted/40 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RecentSchoolSkeleton;
