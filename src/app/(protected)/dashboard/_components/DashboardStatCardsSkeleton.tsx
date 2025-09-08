import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "@/lib/utils";

export function DashboardStatCardsSkeleton() {
  const cells = new Array(4).fill(null);
  return (
    <>
      {cells.map(() => (
        <Card key={generateId()} aria-hidden>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="h-4 w-24 rounded-md bg-muted/40 animate-pulse" />
            </CardTitle>
            <div className="h-4 w-4 rounded-md bg-muted/40 animate-pulse" />
          </CardHeader>

          <CardContent>
            <div className="h-8 w-24 rounded bg-muted/40 animate-pulse mb-2" />
            <div className="h-3 w-32 rounded bg-muted/30 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default DashboardStatCardsSkeleton;
