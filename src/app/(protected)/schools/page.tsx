import { Building2, Edit, MapPin, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NavbarActionButton } from "@/components/NavbarActionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSchools } from "@/services/dataService";
import { AssignHeadMasterWrapper } from "./_components";

export default async function SchoolsPage() {
  const schools = await getSchools();
  const totalStudents = schools.reduce(
    (sum, school) => sum + school.studentCount,
    0,
  );

  return (
    <div className="space-y-6">
      <Header
        title="Gestion des écoles"
        description={`${schools.length} écoles • ${totalStudents.toLocaleString()} étudiants au total`}
        trailing={<NavbarActionButton />}
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une école..." className="pl-10" />
            </div>
            <Button variant="outline">Filtrer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{school.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {school.city}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    school.status === "private" ? "default" : "secondary"
                  }
                >
                  {school.status === "private" ? "Active" : "En attente"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Code</p>
                  <p className="font-medium">{school.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {school.is_technical_education ? "Technique" : "Général"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{school.studentCount}</span>
                <span className="text-muted-foreground">étudiants</span>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Contact</p>
                <p>{school.email}</p>
                <p>{school.phone}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/schools/${school.id}`} prefetch={true}>
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/schools/${school.id}/students`} prefetch={true}>
                    <Users className="h-3 w-3 mr-1" />
                    Étudiants
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <AssignHeadMasterWrapper
                schoolId={school.id}
                schoolName={school.name}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {schools.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune école trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter votre première école à la plateforme.
            </p>
            <Button asChild>
              <Link href="/schools/new" prefetch={true}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une école
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
