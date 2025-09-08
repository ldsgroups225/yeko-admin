import { siteConfig } from "./metadata";

// Base types for structured data
export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

// Organization schema for Yeko Admin
export function generateOrganizationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`,
      width: 200,
      height: 200,
    },
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    sameAs: [siteConfig.social.twitter, siteConfig.social.github].filter(
      Boolean,
    ),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Support technique",
      availableLanguage: "French",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
      addressLocality: "France",
    },
    foundingDate: "2024",
    keywords: siteConfig.keywords.join(", "),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      category: "Logiciel de gestion scolaire",
      description: "Plateforme complète de gestion scolaire",
    },
  };
}

// Website schema
export function generateWebsiteSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "fr-FR",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
    },
  };
}

// Software Application schema for the platform
export function generateSoftwareApplicationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "EducationalApplication",
    applicationSubCategory: "Gestion scolaire",
    operatingSystem: "Web",
    browserRequirements: "Navigateur web moderne",
    softwareVersion: "1.0.0",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      category: "Freemium",
      description: "Plateforme de gestion scolaire",
    },
    featureList: [
      "Gestion des élèves",
      "Suivi de l'assiduité",
      "Évaluation des performances",
      "Organisation des classes",
      "Communication école-parents",
      "Transparence éducative",
    ],
    screenshot: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/screenshots/dashboard.png`,
      caption: "Interface du tableau de bord Yeko Admin",
    },
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
    accessibilityFeature: [
      "alternativeText",
      "readingOrder",
      "structuralNavigation",
    ],
    accessibilityControl: [
      "fullKeyboardControl",
      "fullMouseControl",
      "fullTouchControl",
    ],
  };
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}${crumb.url}`,
        name: crumb.name,
      },
    })),
  };
}

// Educational Course schema (for course management features)
export function generateCourseSchema({
  name,
  description,
  provider,
  instructor,
  courseCode,
  educationalLevel,
  subject,
  duration,
  url,
}: {
  name: string;
  description: string;
  provider: string;
  instructor?: string;
  courseCode?: string;
  educationalLevel?: string;
  subject?: string;
  duration?: string;
  url: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "EducationalOrganization",
      name: provider,
    },
    ...(instructor && {
      instructor: {
        "@type": "Person",
        name: instructor,
      },
    }),
    courseCode,
    educationalLevel,
    about: subject,
    timeRequired: duration,
    url: `${siteConfig.url}${url}`,
    inLanguage: "fr-FR",
    teaches: subject,
    coursePrerequisites: "Aucun prérequis",
    educationalCredentialAwarded: "Certificat de completion",
  };
}

// Person schema (for teacher/student profiles)
export function generatePersonSchema({
  name,
  jobTitle,
  description,
  email,
  url,
  image,
  affiliation,
  expertise,
}: {
  name: string;
  jobTitle?: string;
  description?: string;
  email?: string;
  url: string;
  image?: string;
  affiliation?: string;
  expertise?: string[];
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(email && { email }),
    url: `${siteConfig.url}${url}`,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(affiliation && {
      affiliation: {
        "@type": "EducationalOrganization",
        name: affiliation,
      },
    }),
    ...(expertise && {
      knowsAbout: expertise,
    }),
    worksFor: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
    },
  };
}

// FAQ schema for help pages
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Article schema for blog posts or documentation
export function generateArticleSchema({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  section,
  keywords,
  wordCount,
}: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  section?: string;
  keywords?: string[];
  wordCount?: number;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    }),
    url: `${siteConfig.url}${url}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${url}`,
    },
    ...(section && { articleSection: section }),
    ...(keywords && { keywords: keywords.join(", ") }),
    ...(wordCount && { wordCount }),
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
  };
}

// Event schema for school events
export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  url,
  eventType,
  audience,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  organizer: string;
  url: string;
  eventType?: string;
  audience?: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    ...(location && {
      location: {
        "@type": "Place",
        name: location,
      },
    }),
    organizer: {
      "@type": "EducationalOrganization",
      name: organizer,
    },
    url: `${siteConfig.url}${url}`,
    ...(eventType && { eventAttendanceMode: eventType }),
    ...(audience && {
      audience: {
        "@type": "EducationalAudience",
        audienceType: audience,
      },
    }),
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
  };
}

// How-to schema for tutorials and guides
export function generateHowToSchema({
  name,
  description,
  steps,
  totalTime,
  supply,
  tool,
  url,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  url: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    ...(supply && {
      supply: supply.map((item) => ({
        "@type": "HowToSupply",
        name: item,
      })),
    }),
    ...(tool && {
      tool: tool.map((item) => ({
        "@type": "HowToTool",
        name: item,
      })),
    }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: step.image,
        },
      }),
    })),
    url: `${siteConfig.url}${url}`,
    inLanguage: "fr-FR",
  };
}

// Utility function to combine multiple schemas
export function combineStructuredData(
  ...schemas: StructuredData[]
): StructuredData[] {
  return schemas;
}

// Utility function to generate JSON-LD script tag
export function generateStructuredDataScript(
  data: StructuredData | StructuredData[],
): string {
  const jsonData = Array.isArray(data) ? data : [data];
  return JSON.stringify(jsonData, null, 2);
}

// Predefined structured data for common pages
export const commonStructuredData = {
  // Home page structured data
  home: (): StructuredData[] => [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateSoftwareApplicationSchema(),
  ],

  // Dashboard pages (private, minimal structured data)
  dashboard: (title: string): StructuredData[] => [
    generateBreadcrumbSchema([
      { name: "Accueil", url: "/" },
      { name: "Tableau de bord", url: "/dashboard" },
      { name: title, url: `/dashboard/${title.toLowerCase()}` },
    ]),
  ],

  // Profile pages
  profile: (person: {
    name: string;
    jobTitle?: string;
    description?: string;
    url: string;
    expertise?: string[];
  }): StructuredData[] => [
    generatePersonSchema(person),
    generateBreadcrumbSchema([
      { name: "Accueil", url: "/" },
      { name: "Profils", url: "/profiles" },
      { name: person.name, url: person.url },
    ]),
  ],

  // Documentation pages
  docs: (title: string, url: string): StructuredData[] => [
    generateBreadcrumbSchema([
      { name: "Accueil", url: "/" },
      { name: "Documentation", url: "/docs" },
      { name: title, url },
    ]),
  ],

  // Help/FAQ pages
  help: (
    faqs: Array<{ question: string; answer: string }>,
  ): StructuredData[] => [
    generateFAQSchema(faqs),
    generateBreadcrumbSchema([
      { name: "Accueil", url: "/" },
      { name: "Aide", url: "/help" },
    ]),
  ],
};

// Validation function for structured data
export function validateStructuredData(data: StructuredData): boolean {
  try {
    // Basic validation
    if (!data["@context"] || !data["@type"]) {
      return false;
    }

    // Ensure @context is schema.org
    if (data["@context"] !== "https://schema.org") {
      return false;
    }

    // Validate required fields based on type
    switch (data["@type"]) {
      case "Organization":
      case "EducationalOrganization":
        return !!(data.name && data.url);
      case "WebSite":
        return !!(data.name && data.url);
      case "Article":
        return !!(data.headline && data.author && data.datePublished);
      case "Person":
        return !!data.name;
      case "BreadcrumbList":
        return !!(data.itemListElement && Array.isArray(data.itemListElement));
      default:
        return true; // Allow other types
    }
  } catch {
    return false;
  }
}
