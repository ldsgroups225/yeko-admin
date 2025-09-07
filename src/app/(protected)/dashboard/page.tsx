import {
  Building2,
  GraduationCap,
  School,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data - replace with actual Supabase queries
async function getSchoolStats() {
  // This would be replaced with actual Supabase queries
  return {
    totalSchools: 12,
    activeSchools: 10,
    totalStudents: 2847,
    totalUsers: 156,
    recentSchools: [
      {
        id: "1",
        name: "Lycée Jean Mermoz",
        city: "Dakar",
        studentCount: 450,
        status: "active",
      },
      {
        id: "2",
        name: "Collège Sainte Marie",
        city: "Thiès",
        studentCount: 320,
        status: "active",
      },
      {
        id: "3",
        name: "École Primaire Liberté",
        city: "Saint-Louis",
        studentCount: 180,
        status: "pending",
      },
    ],
    studentsPerSchool: [
      { schoolName: "Lycée Jean Mermoz", studentCount: 450 },
      { schoolName: "Collège Sainte Marie", studentCount: 320 },
      { schoolName: "École Primaire Liberté", studentCount: 180 },
      { schoolName: "Lycée Blaise Diagne", studentCount: 380 },
      { schoolName: "Collège Kennedy", studentCount: 290 },
    ],
  };
}

export default async function DashboardPage() {
  const stats = await getSchoolStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre plateforme de gestion scolaire
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Écoles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {stats.activeSchools} actives
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Étudiants
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Répartis dans {stats.totalSchools} écoles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Enseignants, parents et administrateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne/École</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalStudents / stats.totalSchools)}
            </div>
            <p className="text-xs text-muted-foreground">Étudiants par école</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools and Top Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Écoles récentes
            </CardTitle>
            <CardDescription>
              Dernières écoles ajoutées à la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentSchools.map((school) => (
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
                  <Badge
                    variant={
                      school.status === "active" ? "default" : "secondary"
                    }
                  >
                    {school.status === "active" ? "Active" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/schools">Voir toutes les écoles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Écoles par effectif
            </CardTitle>
            <CardDescription>
              Classement des écoles par nombre d'étudiants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.studentsPerSchool.map((school, index) => (
                <div
                  key={school.schoolName}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {school.schoolName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{school.studentCount}</p>
                    <p className="text-xs text-muted-foreground">étudiants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Gérez votre plateforme scolaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/schools/new">
                <Building2 className="h-6 w-6" />
                Créer une école
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/users/new">
                <UserPlus className="h-6 w-6" />
                Ajouter un utilisateur
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/users">
                <Users className="h-6 w-6" />
                Lier un membre
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
