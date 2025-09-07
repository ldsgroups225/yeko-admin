import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getAvailableSchools,
  getGrades,
  getUserById,
} from "@/services/dataService";

interface Props {
  params: { id: string };
}

export default async function LinkUserPage({ params }: Props) {
  const user = await getUserById(params.id);
  const schools = await getAvailableSchools();
  const grades = await getGrades();

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Utilisateur non trouvé
          </h1>
          <p className="text-muted-foreground">
            L'utilisateur demandé n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Lier un utilisateur
          </h1>
          <p className="text-muted-foreground">
            Associer {user.first_name} {user.last_name} à une école
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
            <CardDescription>Détails de l'utilisateur à lier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <p className="text-lg font-medium">
                {user.first_name} {user.last_name}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <p>{user.email}</p>
            </div>

            <div className="space-y-2">
              <Label>Téléphone</Label>
              <p>{user.phone}</p>
            </div>

            <div className="space-y-2">
              <Label>Rôle</Label>
              <p className="capitalize">
                {user.role === "parent" ? "Parent" : user.role}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* School Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Sélection de l'école</CardTitle>
            <CardDescription>
              Choisir l'école à associer à cet utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school_id">École *</Label>
                <Select name="school_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une école" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name} - {school.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user.role === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="grade_id">
                    Niveau d'enseignement (optionnel)
                  </Label>
                  <Select name="grade_id">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" type="button" asChild>
                  <Link href="/users">Annuler</Link>
                </Button>
                <Button type="submit">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Lier à l'école
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
