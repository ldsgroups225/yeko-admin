import { ArrowLeftIcon, MailIcon, ShieldXIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Next.js 15 unauthorized.js convention
 * This component is rendered when the unauthorized() function is called
 * It provides a fallback UI for authorization failures
 */
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              priority
              src="/logo.png"
              alt="Logo Yeko"
              className="size-24 opacity-90"
              width={96}
              height={96}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <ShieldXIcon className="size-8 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Accès refusé
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Vous n'avez pas l'autorisation d'accéder à cette ressource.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm text-foreground">
              Que faire maintenant ?
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Vérifiez que vous êtes connecté avec le bon compte</li>
              <li>• Assurez-vous d'avoir les permissions nécessaires</li>
              <li>• Contactez votre administrateur si le problème persiste</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-11">
                <Link href="/sign-in">
                  <ArrowLeftIcon className="size-4 mr-2" />
                  Se reconnecter
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full h-11">
                <Link href="mailto:support@yeko-pro.com">
                  <MailIcon className="size-4 mr-2" />
                  Contacter le support
                </Link>
              </Button>
            </div>

            <div className="text-center space-y-2">
              <div className="h-px bg-border" />
              <p className="text-xs text-muted-foreground">
                Code d'erreur: 403 - Forbidden
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
