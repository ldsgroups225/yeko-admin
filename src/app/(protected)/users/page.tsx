import {
  Building2,
  Link as LinkIcon,
  Mail,
  Phone,
  Plus,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with actual Supabase queries
async function getUsers() {
  return [
    {
      id: "1",
      first_name: "Marie",
      last_name: "Diop",
      email: "marie.diop@email.com",
      phone: "+221 77 123 45 67",
      role: "teacher",
      school_name: "Lycée Jean Mermoz",
      school_id: "1",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      first_name: "Amadou",
      last_name: "Fall",
      email: "amadou.fall@email.com",
      phone: "+221 76 987 65 43",
      role: "parent",
      school_name: null,
      school_id: null,
      created_at: "2024-02-20",
    },
    {
      id: "3",
      first_name: "Fatou",
      last_name: "Sall",
      email: "fatou.sall@email.com",
      phone: "+221 78 456 78 90",
      role: "admin",
      school_name: "Collège Sainte Marie",
      school_id: "2",
      created_at: "2024-03-10",
    },
    {
      id: "4",
      first_name: "Ousmane",
      last_name: "Ba",
      email: "ousmane.ba@email.com",
      phone: "+221 70 234 56 78",
      role: "teacher",
      school_name: null,
      school_id: null,
      created_at: "2024-01-30",
    },
  ];
}

const roleLabels = {
  admin: "Administrateur",
  teacher: "Enseignant",
  parent: "Parent",
  student: "Étudiant",
};

const roleColors = {
  admin: "destructive",
  teacher: "default",
  parent: "secondary",
  student: "outline",
} as const;

export default async function UsersPage() {
  const users = await getUsers();
  const unlinkedUsers = users.filter((user) => !user.school_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground">
          {users.length} utilisateurs • {unlinkedUsers.length} non liés à une
          école
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="teacher">Enseignant</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="student">Étudiant</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par école" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les écoles</SelectItem>
                <SelectItem value="linked">Liés à une école</SelectItem>
                <SelectItem value="unlinked">Non liés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Unlinked Users Alert */}
      {unlinkedUsers.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Utilisateurs non liés ({unlinkedUsers.length})
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Ces utilisateurs ne sont pas encore associés à une école. Cliquez
              sur "Lier à une école" pour les associer.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {user.first_name} {user.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Badge
                      variant={roleColors[user.role as keyof typeof roleColors]}
                    >
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </Badge>
                  </CardDescription>
                </div>
                {!user.school_id && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-300"
                  >
                    Non lié
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                {user.school_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.school_name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {user.school_id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/users/${user.id}/edit`}>Modifier</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/users/${user.id}/unlink`}>Délier</Link>
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/users/${user.id}/link`}>
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Lier à une école
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter des utilisateurs à la plateforme.
            </p>
            <Button asChild>
              <Link href="/users/new">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
