import {
  Building2,
  GraduationCap,
  School,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardStats } from "@/services/dataService";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <Header
        title="Tableau de bord"
        description="Vue d'ensemble de votre plateforme de gestion scolaire"
      />

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
              <span className="text-chart-3">
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
    </div>
  );
}
