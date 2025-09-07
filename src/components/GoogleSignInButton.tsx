"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { useGoogleAuthSimple } from "@/hooks/useGoogleAuth";
import { cn } from "@/lib/utils";
import type { OAuthOptions } from "@/types";

// SVG Icon Google officiel
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-5 h-5", className)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Google"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export interface GoogleSignInButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
  /** Mode d'authentification */
  mode?: "signin" | "signup";
  /** Options OAuth personnalisées */
  oauthOptions?: Partial<OAuthOptions>;
  /** Callback appelé après une tentative d'authentification */
  onAuthAttempt?: (success: boolean) => void;
  /** Texte personnalisé pour le bouton */
  customText?: string;
  /** Afficher uniquement l'icône */
  iconOnly?: boolean;
}

/**
 * Composant bouton pour l'authentification Google OAuth
 * Suit les guidelines de design Google et s'intègre au design system de l'app
 */
export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  mode = "signin",
  oauthOptions,
  onAuthAttempt,
  customText,
  iconOnly = false,
  className,
  size = "default",
  disabled,
  ...props
}) => {
  const { googleSignIn, googleSignUp, isLoading } = useGoogleAuthSimple();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const authFunction = mode === "signin" ? googleSignIn : googleSignUp;
    const success = await authFunction(oauthOptions);

    onAuthAttempt?.(success);
  };

  const getButtonText = () => {
    if (customText) return customText;
    if (iconOnly) return "";

    if (isLoading) {
      return mode === "signin" ? "Connexion..." : "Inscription...";
    }

    return mode === "signin"
      ? "Continuer avec Google"
      : "S'inscrire avec Google";
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        // Styles de base pour bouton Google
        "relative border-2 border-border bg-background text-foreground hover:bg-accent",
        "hover:border-border focus:border-ring focus:ring-2 focus:ring-ring/20",
        "transition-all duration-200 shadow-sm hover:shadow-md",
        // Styles pour mode icône uniquement
        iconOnly && "p-3 aspect-square",
        // Espacement pour texte + icône
        !iconOnly && "gap-3 pl-3 pr-4",
        className,
      )}
      {...props}
    >
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Icône Google */}
      <GoogleIcon className={cn("flex-shrink-0", isLoading && "opacity-30")} />

      {/* Texte du bouton */}
      {!iconOnly && (
        <span className={cn("font-medium text-sm", isLoading && "opacity-30")}>
          {getButtonText()}
        </span>
      )}
    </Button>
  );
};

/**
 * Composant séparateur "OU" pour les formulaires d'authentification
 */
export const SocialAuthDivider: React.FC<{
  className?: string;
  text?: string;
}> = ({ className, text = "OU" }) => (
  <div
    className={cn("relative flex items-center justify-center py-4", className)}
  >
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    <div className="relative bg-background px-4">
      <span className="text-sm text-muted-foreground font-medium">{text}</span>
    </div>
  </div>
);

/**
 * Composant conteneur pour les boutons sociaux
 * Fournit un layout cohérent pour plusieurs boutons OAuth
 */
export const SocialAuthContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}> = ({ children, className, direction = "vertical" }) => (
  <div
    className={cn(
      "flex gap-3",
      direction === "vertical" ? "flex-col" : "flex-row items-center",
      className,
    )}
  >
    {children}
  </div>
);
