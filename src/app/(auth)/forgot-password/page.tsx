import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { resetPasswordAction } from "@/actions/auth";
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
import { ForgotPasswordStructuredData } from "../structured-data";

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordStructuredData />
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            Mot de passe oublié
          </CardTitle>
          <CardDescription className="text-muted-foreground px-4">
            Entrez votre adresse email et nous vous enverrons un lien pour
            réinitialiser votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form action={resetPasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@yeko.com"
                  className="pr-10 h-12 border-border focus:border-primary focus:ring-primary"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <MailIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground space-x-4">
            <span>Copyright @yeko 2025</span>
            <span>|</span>
            <button type="button" className="hover:text-foreground">
              Politique de confidentialité
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
