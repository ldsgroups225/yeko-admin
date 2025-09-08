import { getStudentsPerSchoolWrapper } from "@/services/dataService";

export async function StudentsPerSchool() {
  const studentsPerSchool = await getStudentsPerSchoolWrapper();

  return (
    <div className="space-y-4">
      {studentsPerSchool.map((school, index) => (
        <div
          key={school.schoolName}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-foreground">{school.schoolName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{school.studentCount}</p>
            <p className="text-xs text-muted-foreground">étudiants</p>
          </div>
        </div>
      ))}
    </div>
  );
}
