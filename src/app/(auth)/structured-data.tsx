import { StaticStructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

/**
 * Structured data for authentication pages
 * These pages should have minimal structured data since they're private/functional
 */

// Login page structured data
export function SignInStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Connexion", url: "/sign-in" },
  ]);

  // WebPage schema for sign-in page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Connexion - Yeko Admin",
    description:
      "Connectez-vous à votre compte Yeko Admin pour accéder à la plateforme de gestion scolaire",
    url: `${siteConfig.url}/sign-in`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "LoginAction",
      target: `${siteConfig.url}/sign-in`,
      object: {
        "@type": "WebSite",
        name: siteConfig.name,
      },
    },
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="signin-breadcrumb" />
      <StaticStructuredData data={webPageSchema} id="signin-webpage" />
    </>
  );
}

// Forgot password page structured data
export function ForgotPasswordStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Connexion", url: "/sign-in" },
    { name: "Mot de passe oublié", url: "/forgot-password" },
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mot de passe oublié - Yeko Admin",
    description:
      "Réinitialisez votre mot de passe pour retrouver l'accès à votre compte Yeko Admin",
    url: `${siteConfig.url}/forgot-password`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
  };

  return (
    <>
      <StaticStructuredData
        data={breadcrumbSchema}
        id="forgot-password-breadcrumb"
      />
      <StaticStructuredData data={webPageSchema} id="forgot-password-webpage" />
    </>
  );
}

// Auth callback page structured data
export function AuthCallbackStructuredData() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Authentification en cours - Yeko Admin",
    description: "Finalisation de votre connexion à Yeko Admin",
    url: `${siteConfig.url}/callback`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
  };

  return <StaticStructuredData data={webPageSchema} id="callback-webpage" />;
}

// Auth error page structured data
export function AuthErrorStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Connexion", url: "/sign-in" },
    { name: "Erreur d'authentification", url: "/auth-code-error" },
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Erreur d'authentification - Yeko Admin",
    description:
      "Une erreur s'est produite lors de l'authentification. Veuillez réessayer.",
    url: `${siteConfig.url}/auth-code-error`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
  };

  return (
    <>
      <StaticStructuredData
        data={breadcrumbSchema}
        id="auth-error-breadcrumb"
      />
      <StaticStructuredData data={webPageSchema} id="auth-error-webpage" />
    </>
  );
}
