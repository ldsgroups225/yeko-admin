import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAvailableSchools, getGrades } from "@/services/dataService";

export default async function AddUserPage() {
  const schools = await getAvailableSchools();
  const grades = await getGrades();

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
            Nouveau membre d'école
          </h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau membre à une école
          </p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Détails personnels du membre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Ex: Marie"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Ex: Diop"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="marie.diop@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+221 77 123 45 67"
                />
              </div>
            </CardContent>
          </Card>

          {/* Role and School Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Rôle et affectation</CardTitle>
              <CardDescription>
                Définir le rôle et l'école du membre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Enseignant</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="director">Directeur</SelectItem>
                    <SelectItem value="educator">Éducateur</SelectItem>
                    <SelectItem value="accountant">Comptable</SelectItem>
                    <SelectItem value="headmaster">Proviseur</SelectItem>
                    <SelectItem value="cashier">Caissier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations additionnelles</CardTitle>
            <CardDescription>
              Détails supplémentaires sur le membre
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state_id">Région</Label>
                <Select name="state_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dakar</SelectItem>
                    <SelectItem value="2">Thiès</SelectItem>
                    <SelectItem value="3">Saint-Louis</SelectItem>
                    <SelectItem value="4">Kaolack</SelectItem>
                    <SelectItem value="5">Ziguinchor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">Photo de profil (URL)</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  placeholder="https://exemple.com/photo.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Informations supplémentaires sur ce membre..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="send_welcome_email" name="send_welcome_email" />
              <Label htmlFor="send_welcome_email">
                Envoyer un email de bienvenue
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/users">Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Créer le membre
          </Button>
        </div>
      </form>
    </div>
  );
}
