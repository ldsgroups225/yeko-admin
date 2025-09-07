import { ArrowLeftIcon, MailIcon, ShieldXIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Next.js 15 forbidden.tsx convention
 * This component is rendered when the forbidden() function is called
 * It provides a fallback UI for authorization failures (403 errors)
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
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
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <ShieldXIcon className="size-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Accès interdit
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Vous n'avez pas les permissions nécessaires pour accéder à cette
                ressource.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm text-foreground">
              Pourquoi cette erreur ?
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Votre compte n'a pas les droits d'administrateur requis</li>
              <li>• Cette section est réservée aux super administrateurs</li>
              <li>• Vos permissions ont peut-être été modifiées récemment</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full h-11">
                <Link href="/dashboard">
                  <ArrowLeftIcon className="size-4 mr-2" />
                  Retour au tableau de bord
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full h-11">
                <Link href="mailto:support@yeko-pro.com">
                  <MailIcon className="size-4 mr-2" />
                  Demander l'accès
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
