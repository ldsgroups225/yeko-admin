import { Badge } from "@/components/ui/badge";
import { getRecentSchoolsWrapper } from "@/services/dataService";

export async function RecentSchool() {
  const recentSchools = await getRecentSchoolsWrapper();

  return (
    <div className="space-y-4">
      {recentSchools.map((school) => (
        <div
          key={school.id}
          className="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div className="flex-1">
            <p className="font-medium text-foreground">{school.name}</p>
            <p className="text-sm text-muted-foreground">
              {school.city} • {school.studentCount} étudiants
            </p>
          </div>
          <Badge variant={school.status === "active" ? "default" : "secondary"}>
            {school.status === "active" ? "Active" : "En attente"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
