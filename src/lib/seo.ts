import type { Metadata, Viewport } from "next";
import { siteConfig } from "./metadata";

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// Enhanced Open Graph image generation
export interface OGImageOptions {
  title: string;
  description?: string;
  type?: "website" | "article" | "profile";
  width?: number;
  height?: number;
}

export function generateOGImageUrl({
  title,
  description,
  type = "website",
  width = 1200,
  height = 630,
}: OGImageOptions): string {
  const params = new URLSearchParams({
    title,
    type,
    width: width.toString(),
    height: height.toString(),
  });

  if (description) {
    params.set("description", description);
  }

  return `/api/og?${params.toString()}`;
}

// SEO-optimized metadata for different content types
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  priority?: number;
  changeFreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export function createSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [],
  section,
  tags = [],
  locale = "fr_FR",
  alternateLocales = [],
  canonical,
  noIndex = false,
  noFollow = false,
}: SEOConfig): Metadata {
  const pageTitle = title;
  const pageDescription = description;
  const pageImage = image || generateOGImageUrl({ title, description, type });
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const pageKeywords = [...siteConfig.keywords, ...keywords];

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors:
      authors.length > 0
        ? authors.map((author) => ({ name: author }))
        : siteConfig.authors,
    generator: "Next.js",
    applicationName: siteConfig.name,
    referrer: "origin-when-cross-origin",
    colorScheme: "dark light",
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type,
      locale,
      alternateLocale: alternateLocales,
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors.length > 0 ? authors : [siteConfig.creator],
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
      title: pageTitle,
      description: pageDescription,
      images: {
        url: pageImage,
        alt: title,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonical || pageUrl,
      languages: alternateLocales.reduce(
        (acc, locale) => {
          acc[locale] = `${pageUrl}/${locale}`;
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
  };

  return metadata;
}

// Predefined metadata configurations for common page types
export const seoTemplates = {
  home: (): Metadata =>
    createSEOMetadata({
      title: siteConfig.name,
      description: siteConfig.description,
      keywords: [
        "gestion scolaire",
        "plateforme éducative",
        "suivi élèves",
        "administration scolaire",
      ],
      url: "/",
    }),

  dashboard: (title: string, description?: string): Metadata =>
    createSEOMetadata({
      title: `Tableau de bord ${title}`,
      description:
        description ||
        `Gérez vos ${title.toLowerCase()} avec notre tableau de bord complet`,
      keywords: [
        "tableau de bord",
        "administration",
        "gestion",
        title.toLowerCase(),
      ],
      url: `/dashboard/${title.toLowerCase()}`,
      noIndex: true,
    }),

  auth: (type: "login" | "signup" | "reset"): Metadata =>
    createSEOMetadata({
      title:
        type === "login"
          ? "Connexion"
          : type === "signup"
            ? "Inscription"
            : "Réinitialiser le mot de passe",
      description:
        type === "login"
          ? "Connectez-vous à votre compte pour accéder au tableau de bord"
          : type === "signup"
            ? "Créez un nouveau compte pour commencer"
            : "Réinitialisez votre mot de passe pour retrouver l'accès à votre compte",
      keywords: ["authentification", type, "compte", "accès"],
      url: `/auth/${type}`,
      noIndex: true,
    }),

  profile: (username: string): Metadata =>
    createSEOMetadata({
      title: `${username}'s Profile`,
      description: `View ${username}'s profile and activity`,
      keywords: ["profile", "user", username],
      url: `/profile/${username}`,
      type: "profile",
    }),

  article: (
    title: string,
    description: string,
    options: {
      authors: string[];
      publishedTime: string;
      modifiedTime?: string;
      section?: string;
      tags?: string[];
      slug: string;
    },
  ): Metadata =>
    createSEOMetadata({
      title,
      description,
      keywords: options.tags || [],
      url: `/articles/${options.slug}`,
      type: "article",
      authors: options.authors,
      publishedTime: options.publishedTime,
      modifiedTime: options.modifiedTime,
      section: options.section,
      tags: options.tags,
    }),

  error: (code: number): Metadata =>
    createSEOMetadata({
      title: `Erreur ${code}`,
      description:
        code === 404
          ? "La page que vous recherchez n'existe pas"
          : "Une erreur s'est produite lors du traitement de votre demande",
      keywords: ["erreur", code.toString()],
      noIndex: true,
    }),
};

// Utility functions for dynamic metadata generation
export function createBreadcrumbMetadata(
  breadcrumbs: Array<{ name: string; url: string }>,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.url}`,
    })),
  };
}

export function createArticleMetadata(article: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image:
      article.image ||
      generateOGImageUrl({
        title: article.title,
        description: article.description,
      }),
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${article.url}`,
    },
  };
}

// Social media sharing utilities
export function generateSocialShareUrls(
  url: string,
  title: string,
  description?: string,
) {
  const encodedUrl = encodeURIComponent(`${siteConfig.url}${url}`);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
}
