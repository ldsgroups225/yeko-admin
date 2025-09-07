import { Save } from "lucide-react";
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

export default function NewSchoolPage() {
  return (
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
                placeholder="Ex: Lycée Classique d'Abidjan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code de l'école *</Label>
              <Input id="code" name="code" placeholder="Ex: LJM001" required />
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
                placeholder="+225 xx xx xx xxxx"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input id="city" name="city" placeholder="Ex: Abidjan" required />
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
              <Label htmlFor="state_id">État</Label>
              <Select name="state_id" defaultValue="2">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un état" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="2">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Public ou Privé</Label>
              <Select name="status" defaultValue="private">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privé</SelectItem>
                  <SelectItem value="public">Publique</SelectItem>
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
  );
}
