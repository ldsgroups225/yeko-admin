"use client";

import { Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createSchool } from "@/actions/schools";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const initialState = {
  message: "",
  errors: {},
};

export default function NewSchoolPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createSchool,
    initialState,
  );

  // Handle successful creation
  useEffect(() => {
    if (state?.success) {
      toast.success("École créée avec succès");
      router.push("/schools");
    }
  }, [state?.success, router]);

  return (
    <form className="space-y-6" action={formAction}>
      {/* Display error message */}
      {state?.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

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
                aria-describedby={
                  state?.errors?.name ? "name-error" : undefined
                }
              />
              {state?.errors?.name && (
                <div id="name-error" className="text-sm text-red-600">
                  {state.errors.name.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code de l'école *</Label>
              <Input
                id="code"
                name="code"
                placeholder="Ex: LJM001"
                required
                aria-describedby={
                  state?.errors?.code ? "code-error" : undefined
                }
              />
              {state?.errors?.code && (
                <div id="code-error" className="text-sm text-red-600">
                  {state.errors.code.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle_id">Cycle d'enseignement *</Label>
              <Select name="cycle_id" required defaultValue="secondary">
                <SelectTrigger
                  aria-describedby={
                    state?.errors?.cycle_id ? "cycle_id-error" : undefined
                  }
                >
                  <SelectValue placeholder="Sélectionner un cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primaire</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.cycle_id && (
                <div id="cycle_id-error" className="text-sm text-red-600">
                  {state.errors.cycle_id.join(", ")}
                </div>
              )}
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
                placeholder="exemple@email.com"
                required
                aria-describedby={
                  state?.errors?.email ? "email-error" : undefined
                }
              />
              {state?.errors?.email && (
                <div id="email-error" className="text-sm text-red-600">
                  {state.errors.email.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+225 xx xx xx xxxx"
                required
                aria-describedby={
                  state?.errors?.phone ? "phone-error" : undefined
                }
              />
              {state?.errors?.phone && (
                <div id="phone-error" className="text-sm text-red-600">
                  {state.errors.phone.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Ex: Abidjan"
                required
                aria-describedby={
                  state?.errors?.city ? "city-error" : undefined
                }
              />
              {state?.errors?.city && (
                <div id="city-error" className="text-sm text-red-600">
                  {state.errors.city.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Adresse complète de l'école"
                rows={3}
                aria-describedby={
                  state?.errors?.address ? "address-error" : undefined
                }
              />
              {state?.errors?.address && (
                <div id="address-error" className="text-sm text-red-600">
                  {state.errors.address.join(", ")}
                </div>
              )}
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
              <Select name="state_id" defaultValue="3">
                <SelectTrigger
                  aria-describedby={
                    state?.errors?.state_id ? "state_id-error" : undefined
                  }
                >
                  <SelectValue placeholder="Sélectionner un état" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="3">Suspendu</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.state_id && (
                <div id="state_id-error" className="text-sm text-red-600">
                  {state.errors.state_id.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Public ou Privé</Label>
              <Select name="status" defaultValue="private">
                <SelectTrigger
                  aria-describedby={
                    state?.errors?.status ? "status-error" : undefined
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privé</SelectItem>
                  <SelectItem value="public">Publique</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.status && (
                <div id="status-error" className="text-sm text-red-600">
                  {state.errors.status.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Logo de l'école (URL)</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://exemple.com/logo.png"
              aria-describedby={
                state?.errors?.image_url ? "image_url-error" : undefined
              }
            />
            {state?.errors?.image_url && (
              <div id="image_url-error" className="text-sm text-red-600">
                {state.errors.image_url.join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" asChild>
          <Link href="/schools">Annuler</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          <Save className="h-4 w-4 mr-2" />
          {pending ? "Création..." : "Créer l'école"}
        </Button>
      </div>
    </form>
  );
}
