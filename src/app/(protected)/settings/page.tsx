import {
  Bell,
  Database,
  Globe,
  Palette,
  Save,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre plateforme Yeko Admin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Base de données
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Général
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil administrateur
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_first_name">Prénom</Label>
                  <Input
                    id="admin_first_name"
                    name="admin_first_name"
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_last_name">Nom</Label>
                  <Input
                    id="admin_last_name"
                    name="admin_last_name"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email">Email</Label>
                <Input
                  id="admin_email"
                  name="admin_email"
                  type="email"
                  placeholder="admin@yeko.sn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_phone">Téléphone</Label>
                <Input
                  id="admin_phone"
                  name="admin_phone"
                  type="tel"
                  placeholder="+221 77 123 45 67"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajouter une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Connexions suspectes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des alertes pour les connexions inhabituelles
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouveaux utilisateurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifier lors de l'ajout de nouveaux utilisateurs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles écoles</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifier lors de l'ajout de nouvelles écoles
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Erreurs système</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifier en cas d'erreurs critiques
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports hebdomadaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un résumé hebdomadaire
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification_email">
                  Email de notification
                </Label>
                <Input
                  id="notification_email"
                  name="notification_email"
                  type="email"
                  placeholder="notifications@yeko.sn"
                />
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configuration générale de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform_name">Nom de la plateforme</Label>
                <Input
                  id="platform_name"
                  name="platform_name"
                  placeholder="Yeko Admin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_language">Langue par défaut</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select defaultValue="africa/dakar">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa/dakar">Dakar (GMT+0)</SelectItem>
                    <SelectItem value="africa/abidjan">
                      Abidjan (GMT+0)
                    </SelectItem>
                    <SelectItem value="africa/accra">Accra (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_message">
                  Message de maintenance
                </Label>
                <Textarea
                  id="maintenance_message"
                  name="maintenance_message"
                  placeholder="Message affiché pendant la maintenance..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le mode maintenance
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
