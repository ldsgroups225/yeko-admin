import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewSchoolPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/schools">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle école</h1>
          <p className="text-muted-foreground">
            Ajouter une nouvelle école à la plateforme
          </p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails de base de l'école</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'école *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Lycée Jean Mermoz"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code de l'école *</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ex: LJM001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle_id">Cycle d'enseignement *</Label>
                <Select name="cycle_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primaire</SelectItem>
                    <SelectItem value="secondary">Secondaire</SelectItem>
                    <SelectItem value="higher">Supérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_technical_education"
                  name="is_technical_education"
                />
                <Label htmlFor="is_technical_education">
                  École d'enseignement technique
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Coordonnées de l'école</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@ecole.sn"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+221 33 123 45 67"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input id="city" name="city" placeholder="Ex: Dakar" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Adresse complète de l'école"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres additionnels</CardTitle>
            <CardDescription>Configuration avancée de l'école</CardDescription>
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
                <Label htmlFor="status">Statut initial</Label>
                <Select name="status" defaultValue="pending">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Logo de l'école (URL)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://exemple.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/schools">Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Créer l'école
          </Button>
        </div>
      </form>
    </div>
  );
}
