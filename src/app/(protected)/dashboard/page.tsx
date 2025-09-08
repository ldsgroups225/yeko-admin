import { School, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DashboardStatCards,
  DashboardStatCardsSkeleton,
  RecentSchool,
  RecentSchoolSkeleton,
  StudentsPerSchool,
  StudentsPerSchoolSkeleton,
} from "./_components";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Tableau de bord"
        description="Vue d'ensemble de votre plateforme de gestion scolaire"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense fallback={<DashboardStatCardsSkeleton />}>
          <DashboardStatCards />
        </Suspense>
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
            <Suspense fallback={<RecentSchoolSkeleton />}>
              <RecentSchool />
            </Suspense>
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
            <Suspense fallback={<StudentsPerSchoolSkeleton />}>
              <StudentsPerSchool />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
