import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-secondary/20 p-4">
                <AlertTriangleIcon className="size-8 text-secondary-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Erreur d'authentification
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Une erreur s'est produite lors de la connexion. Veuillez
                réessayer.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm text-foreground">
              Que s'est-il passé ?
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Le code d'authentification a peut-être expiré</li>
              <li>• La connexion avec le fournisseur a été interrompue</li>
              <li>• Une erreur temporaire s'est produite</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full h-11">
              <Link href="/sign-in">
                <ArrowLeftIcon className="size-4 mr-2" />
                Retour à la connexion
              </Link>
            </Button>

            <div className="text-center space-y-2">
              <div className="h-px bg-border" />
              <p className="text-xs text-muted-foreground">
                Si le problème persiste, contactez le support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
