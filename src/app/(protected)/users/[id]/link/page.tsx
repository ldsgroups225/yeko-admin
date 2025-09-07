import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual Supabase queries
async function getUser(id: string) {
  return {
    id,
    first_name: "Amadou",
    last_name: "Fall",
    email: "amadou.fall@email.com",
    phone: "+221 76 987 65 43",
    role: "parent",
  };
}

async function getAvailableSchools() {
  return [
    { id: "1", name: "Lycée Jean Mermoz", city: "Dakar" },
    { id: "2", name: "Collège Sainte Marie", city: "Thiès" },
    { id: "3", name: "École Primaire Liberté", city: "Saint-Louis" },
    { id: "4", name: "Centre de Formation Technique", city: "Kaolack" },
  ];
}

interface Props {
  params: { id: string };
}

export default async function LinkUserPage({ params }: Props) {
  const user = await getUser(params.id);
  const schools = await getAvailableSchools();

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
                      <SelectItem value="1">CP</SelectItem>
                      <SelectItem value="2">CE1</SelectItem>
                      <SelectItem value="3">CE2</SelectItem>
                      <SelectItem value="4">CM1</SelectItem>
                      <SelectItem value="5">CM2</SelectItem>
                      <SelectItem value="6">6ème</SelectItem>
                      <SelectItem value="7">5ème</SelectItem>
                      <SelectItem value="8">4ème</SelectItem>
                      <SelectItem value="9">3ème</SelectItem>
                      <SelectItem value="10">2nde</SelectItem>
                      <SelectItem value="11">1ère</SelectItem>
                      <SelectItem value="12">Terminale</SelectItem>
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
