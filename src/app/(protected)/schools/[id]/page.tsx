import { getSchoolById } from "@/services/dataService";
import { UpdateSchoolForm } from "./_components";

interface UpdateSchoolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateSchoolPage({
  params,
}: UpdateSchoolPageProps) {
  const { id } = await params;
  const school = await getSchoolById(id);

  if (!school) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            École non trouvée
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            L'école demandée n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  return <UpdateSchoolForm school={school} />;
}
