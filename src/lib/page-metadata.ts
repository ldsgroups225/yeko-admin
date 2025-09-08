import type { Metadata } from "next";
import { siteConfig } from "./metadata";
import { createSEOMetadata, generateOGImageUrl } from "./seo";

// Home page metadata
export function generateHomeMetadata(): Metadata {
  return createSEOMetadata({
    title: `${siteConfig.name} - Plateforme Éducative de Gestion Scolaire`,
    description:
      "Plateforme éducative complète de gestion scolaire pour suivre la vie scolaire des élèves. Apportez la transparence éducative à votre établissement avec nos outils de gestion modernes et intuitifs.",
    keywords: [
      "gestion scolaire",
      "plateforme éducative",
      "suivi élèves",
      "administration scolaire",
      "transparence éducative",
      "dossiers élèves",
      "assiduité",
      "performances scolaires",
      "organisation classes",
      "communication école",
    ],
    url: "/",
    type: "website",
  });
}

// Dashboard page metadata
export function generateDashboardMetadata(
  title: string,
  description?: string,
  path?: string,
): Metadata {
  return createSEOMetadata({
    title: `Tableau de bord ${title}`,
    description:
      description ||
      `Gérez efficacement vos ${title.toLowerCase()} avec notre interface de tableau de bord complète.`,
    keywords: [
      "tableau de bord",
      "administration",
      "gestion",
      title.toLowerCase(),
    ],
    url: path || `/dashboard/${title.toLowerCase().replace(/\s+/g, "-")}`,
    noIndex: true, // Dashboard pages are typically private
    noFollow: true,
  });
}

// Authentication page metadata
export function generateAuthMetadata(
  type: "login" | "signup" | "reset-password" | "verify-email",
): Metadata {
  const titles = {
    login: "Connexion",
    signup: "Créer un compte",
    "reset-password": "Réinitialiser le mot de passe",
    "verify-email": "Vérifier l'email",
  };

  const descriptions = {
    login:
      "Connectez-vous à votre compte pour accéder au tableau de bord et gérer votre établissement scolaire.",
    signup:
      "Créez un nouveau compte pour commencer avec notre plateforme de gestion scolaire complète.",
    "reset-password":
      "Réinitialisez votre mot de passe pour retrouver l'accès à votre compte et tableau de bord.",
    "verify-email":
      "Vérifiez votre adresse email pour finaliser la configuration de votre compte et accéder au tableau de bord.",
  };

  return createSEOMetadata({
    title: titles[type],
    description: descriptions[type],
    keywords: [
      "authentification",
      type.replace("-", " "),
      "compte",
      "accès",
      "tableau de bord",
    ],
    url: `/auth/${type}`,
    noIndex: true,
    noFollow: true,
  });
}

// Profile page metadata
export function generateProfileMetadata(
  username: string,
  displayName?: string,
  bio?: string,
): Metadata {
  const title = displayName || username;
  const description = bio
    ? `${title}'s profile - ${bio.substring(0, 150)}${bio.length > 150 ? "..." : ""}`
    : `View ${title}'s profile and activity on ${siteConfig.name}.`;

  return createSEOMetadata({
    title: `${title}'s Profile`,
    description,
    keywords: ["profile", "user", username, displayName].filter(
      Boolean,
    ) as string[],
    url: `/profile/${username}`,
    type: "profile",
    image: generateOGImageUrl({
      title: `${title}'s Profile`,
      description: bio || `${title} on ${siteConfig.name}`,
      type: "profile",
    }),
  });
}

// Settings page metadata
export function generateSettingsMetadata(section?: string): Metadata {
  const title = section ? `${section} Settings` : "Settings";
  const description = section
    ? `Configure your ${section.toLowerCase()} settings and preferences.`
    : "Manage your account settings, preferences, and configuration options.";

  return createSEOMetadata({
    title,
    description,
    keywords: [
      "settings",
      "preferences",
      "configuration",
      section?.toLowerCase(),
    ].filter(Boolean) as string[],
    url: section ? `/settings/${section.toLowerCase()}` : "/settings",
    noIndex: true,
    noFollow: true,
  });
}

// Error page metadata
export function generateErrorMetadata(
  statusCode: number,
  title?: string,
  description?: string,
): Metadata {
  const errorTitles: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Page Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  const errorDescriptions: Record<number, string> = {
    400: "The request could not be understood by the server due to malformed syntax.",
    401: "You need to sign in to access this page.",
    403: "You don't have permission to access this resource.",
    404: "The page you're looking for doesn't exist or has been moved.",
    500: "An internal server error occurred. Please try again later.",
    502: "The server received an invalid response from the upstream server.",
    503: "The service is temporarily unavailable. Please try again later.",
  };

  return createSEOMetadata({
    title: title || `${statusCode} - ${errorTitles[statusCode] || "Error"}`,
    description:
      description ||
      errorDescriptions[statusCode] ||
      "An error occurred while processing your request.",
    keywords: [
      "error",
      statusCode.toString(),
      "page not found",
      "server error",
    ],
    noIndex: true,
    noFollow: true,
  });
}

// Search page metadata
export function generateSearchMetadata(
  query?: string,
  resultsCount?: number,
): Metadata {
  const title = query ? `Search results for "${query}"` : "Search";
  const description =
    query && resultsCount !== undefined
      ? `Found ${resultsCount} results for "${query}". Search through our comprehensive database.`
      : "Search through our comprehensive database to find what you're looking for.";

  return createSEOMetadata({
    title,
    description,
    keywords: ["search", "results", "find", query].filter(Boolean) as string[],
    url: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    noIndex: !query, // Only index search pages with queries
  });
}

// Documentation page metadata
export function generateDocsMetadata(
  title: string,
  description: string,
  section?: string,
  slug?: string,
): Metadata {
  return createSEOMetadata({
    title: `${title} - Documentation`,
    description,
    keywords: [
      "documentation",
      "docs",
      "guide",
      "tutorial",
      "help",
      section,
      ...title.toLowerCase().split(" "),
    ].filter(Boolean) as string[],
    url: slug ? `/docs/${slug}` : "/docs",
    type: "article",
    section: section || "Documentation",
  });
}

// API documentation metadata
export function generateAPIDocsMetadata(
  endpoint?: string,
  method?: string,
): Metadata {
  const title = endpoint
    ? `${method?.toUpperCase() || "API"} ${endpoint} - API Documentation`
    : "API Documentation";

  const description = endpoint
    ? `Documentation for the ${method?.toUpperCase() || ""} ${endpoint} API endpoint. Learn how to integrate with our API.`
    : "Comprehensive API documentation for developers. Learn how to integrate with our platform.";

  return createSEOMetadata({
    title,
    description,
    keywords: [
      "api",
      "documentation",
      "developer",
      "integration",
      "rest api",
      "endpoints",
      method,
      endpoint,
    ].filter(Boolean) as string[],
    url: endpoint ? `/docs/api${endpoint}` : "/docs/api",
    type: "article",
    section: "API Documentation",
  });
}

// Blog/Article metadata
export function generateArticleMetadata({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  category,
  slug,
  image,
}: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
  category?: string;
  slug: string;
  image?: string;
}): Metadata {
  return createSEOMetadata({
    title,
    description,
    keywords: [...tags, category, "article", "blog"].filter(
      Boolean,
    ) as string[],
    url: `/blog/${slug}`,
    type: "article",
    authors: [author],
    publishedTime,
    modifiedTime,
    section: category || "Blog",
    tags,
    image:
      image ||
      generateOGImageUrl({
        title,
        description,
        type: "article",
      }),
  });
}
