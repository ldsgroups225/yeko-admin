import type { Metadata } from "next";

// Base configuration for the application
export const siteConfig = {
  name: "Yeko Admin",
  description:
    "Yeko Admin est une plateforme éducative complète de gestion scolaire conçue pour suivre la vie scolaire des élèves. Elle vise à apporter la \"transparence éducative\" en donnant aux établissements les outils nécessaires pour gérer efficacement leurs opérations, y compris les dossiers des élèves, l'assiduité, les performances, l'organisation des classes, et la communication entre l'école, les enseignants et les parents.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  creator: "Yeko Team",
  locale: "fr_FR",
  language: "fr",
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
    "enseignants",
    "parents",
    "établissement scolaire",
    "vie scolaire",
  ],
  authors: [
    {
      name: "Yeko Team",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  ],
  social: {
    twitter: "@yeko",
    github: "https://github.com/yeko",
  },
};

// Default metadata configuration
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

// Metadata generation utilities
export interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateMetadata({
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
  noIndex = false,
  canonical,
}: MetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const pageKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors:
      authors.length > 0
        ? authors.map((author) => ({ name: author }))
        : siteConfig.authors,
    openGraph: {
      type,
      locale: "fr_FR",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
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
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.social.twitter,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: canonical || pageUrl,
    },
  };
}

// Specific metadata generators for common page types
export function generatePageMetadata(props: MetadataProps): Metadata {
  return generateMetadata({
    type: "website",
    ...props,
  });
}

export function generateArticleMetadata(
  props: MetadataProps & {
    publishedTime: string;
    modifiedTime?: string;
    authors: string[];
    section?: string;
    tags?: string[];
  },
): Metadata {
  return generateMetadata({
    type: "article",
    ...props,
  });
}

export function generateProfileMetadata(props: MetadataProps): Metadata {
  return generateMetadata({
    type: "profile",
    ...props,
  });
}

// Dashboard-specific metadata generators
export function generateDashboardMetadata(
  title: string,
  description?: string,
): Metadata {
  return generatePageMetadata({
    title,
    description:
      description || `${title} - Gérez efficacement vos ${title.toLowerCase()}`,
    keywords: [
      "tableau de bord",
      "administration",
      "gestion",
      title.toLowerCase(),
    ],
    noIndex: true, // Dashboard pages typically shouldn't be indexed
  });
}

export function generateAuthMetadata(
  title: string,
  description?: string,
): Metadata {
  return generatePageMetadata({
    title,
    description: description || `${title} pour accéder à votre compte`,
    keywords: ["connexion", "inscription", "authentification", "compte"],
    noIndex: true, // Auth pages shouldn't be indexed
  });
}

// Utility to merge metadata
export function mergeMetadata(
  base: Metadata,
  override: Partial<Metadata>,
): Metadata {
  const mergedRobots =
    base.robots && override.robots
      ? {
          ...(base.robots as Record<string, string | boolean>),
          ...(override.robots as Record<string, string | boolean>),
        }
      : override.robots || base.robots;

  return {
    ...base,
    ...override,
    openGraph: {
      ...base.openGraph,
      ...override.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...override.twitter,
    },
    robots: mergedRobots,
  };
}
