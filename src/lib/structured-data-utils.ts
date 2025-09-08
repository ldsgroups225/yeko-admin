import type { Metadata } from "next";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  type StructuredData,
} from "./structured-data";

// Utility to extract structured data from Next.js metadata
export function extractStructuredDataFromMetadata(
  metadata: Metadata,
): StructuredData[] {
  const schemas: StructuredData[] = [];

  // Extract article data if it's an article type
  if (
    metadata.openGraph &&
    typeof metadata.openGraph === "object" &&
    "type" in metadata.openGraph &&
    metadata.openGraph.type === "article"
  ) {
    const og = metadata.openGraph as Record<string, unknown>;
    const authors = Array.isArray(metadata.authors)
      ? metadata.authors
      : metadata.authors
        ? [metadata.authors]
        : [];
    const images = Array.isArray(og.images)
      ? og.images
      : og.images
        ? [og.images]
        : [];

    const articleData = {
      headline: (metadata.title as string) || "",
      description: metadata.description || "",
      author: authors[0]?.name || "Yeko Team",
      datePublished: (og.publishedTime as string) || new Date().toISOString(),
      dateModified: og.modifiedTime as string,
      image: images[0]?.url,
      url: typeof og.url === "string" ? og.url : og.url?.toString() || "",
      section: og.section as string,
      keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
    };

    schemas.push(generateArticleSchema(articleData));
  }

  return schemas;
}

// Generate structured data for educational content
export function generateEducationalContentSchema({
  title,
  description,
  type,
  level,
  subject,
  duration,
  instructor,
  url,
  prerequisites = [],
  learningOutcomes = [],
}: {
  title: string;
  description: string;
  type: "course" | "lesson" | "tutorial" | "guide";
  level?: "débutant" | "intermédiaire" | "avancé";
  subject?: string;
  duration?: string;
  instructor?: string;
  url: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
}): StructuredData {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    educationalLevel: level,
    about: subject,
    timeRequired: duration,
    url,
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
    learningResourceType: type,
    ...(instructor && {
      author: {
        "@type": "Person",
        name: instructor,
      },
    }),
    ...(prerequisites.length > 0 && {
      coursePrerequisites: prerequisites.join(", "),
    }),
    ...(learningOutcomes.length > 0 && {
      teaches: learningOutcomes,
    }),
  };

  return baseSchema;
}

// Generate structured data for school events
export function generateSchoolEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  url,
  _eventType = "EducationEvent",
  audience = "Élèves et enseignants",
  isVirtual = false,
  registrationRequired = false,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  organizer: string;
  url: string;
  _eventType?: string;
  audience?: string;
  isVirtual?: boolean;
  registrationRequired?: boolean;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    eventAttendanceMode: isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(location && {
      location: isVirtual
        ? {
            "@type": "VirtualLocation",
            url: location,
          }
        : {
            "@type": "Place",
            name: location,
          },
    }),
    organizer: {
      "@type": "EducationalOrganization",
      name: organizer,
    },
    url,
    audience: {
      "@type": "EducationalAudience",
      audienceType: audience,
    },
    inLanguage: "fr-FR",
    isAccessibleForFree: !registrationRequired,
    ...(registrationRequired && {
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "EUR",
        validFrom: new Date().toISOString(),
      },
    }),
  };
}

// Generate structured data for student/teacher profiles
export function generateEducationalPersonSchema({
  name,
  role,
  description,
  email,
  url,
  image,
  institution,
  subjects = [],
  qualifications = [],
  experience,
}: {
  name: string;
  role: "enseignant" | "élève" | "administrateur" | "parent";
  description?: string;
  email?: string;
  url: string;
  image?: string;
  institution?: string;
  subjects?: string[];
  qualifications?: string[];
  experience?: string;
}): StructuredData {
  const jobTitles = {
    enseignant: "Enseignant",
    élève: "Élève",
    administrateur: "Administrateur scolaire",
    parent: "Parent d'élève",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: jobTitles[role],
    ...(description && { description }),
    ...(email && { email }),
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(institution && {
      affiliation: {
        "@type": "EducationalOrganization",
        name: institution,
      },
    }),
    ...(subjects.length > 0 && {
      knowsAbout: subjects,
    }),
    ...(qualifications.length > 0 && {
      hasCredential: qualifications.map((qual) => ({
        "@type": "EducationalOccupationalCredential",
        name: qual,
      })),
    }),
    ...(experience && {
      hasOccupation: {
        "@type": "Occupation",
        name: jobTitles[role],
        description: experience,
      },
    }),
  };
}

// Generate structured data for educational assessments
export function generateAssessmentSchema({
  name,
  description,
  _assessmentType,
  subject,
  educationalLevel,
  duration,
  maxScore,
  passingScore,
  url,
}: {
  name: string;
  description: string;
  _assessmentType: "quiz" | "exam" | "assignment" | "project";
  subject: string;
  educationalLevel?: string;
  duration?: string;
  maxScore?: number;
  passingScore?: number;
  url: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    about: subject,
    ...(educationalLevel && { educationalLevel }),
    ...(duration && { timeRequired: duration }),
    url,
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
    ...(maxScore && {
      totalQuestions: maxScore,
    }),
    ...(passingScore && {
      passingScore,
    }),
    assesses: subject,
    educationalUse: "assessment",
  };
}

// Generate structured data for class schedules
export function generateScheduleSchema({
  name,
  description,
  startDate,
  endDate,
  repeatFrequency,
  dayOfWeek,
  startTime,
  endTime,
  location,
  instructor,
  subject,
  url,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  repeatFrequency?: "weekly" | "daily" | "monthly";
  dayOfWeek?: string[];
  startTime?: string;
  endTime?: string;
  location?: string;
  instructor?: string;
  subject?: string;
  url: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Schedule",
    name,
    description,
    startDate,
    endDate,
    ...(repeatFrequency && {
      repeatFrequency: `P1${repeatFrequency.charAt(0).toUpperCase()}`,
    }),
    ...(dayOfWeek && {
      byDay: dayOfWeek,
    }),
    ...(startTime && { startTime }),
    ...(endTime && { endTime }),
    ...(location && {
      location: {
        "@type": "Place",
        name: location,
      },
    }),
    ...(instructor && {
      organizer: {
        "@type": "Person",
        name: instructor,
      },
    }),
    ...(subject && { about: subject }),
    url,
    inLanguage: "fr-FR",
  };
}

// Utility to generate breadcrumbs from URL path
export function generateBreadcrumbsFromPath(
  pathname: string,
  customLabels: Record<string, string> = {},
): StructuredData {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Accueil", url: "/" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label =
      customLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    breadcrumbs.push({
      name: label,
      url: currentPath,
    });
  }

  return generateBreadcrumbSchema(breadcrumbs);
}

// Utility to validate and clean structured data
export function cleanStructuredData(data: StructuredData): StructuredData {
  const cleaned = { ...data };

  // Remove undefined values
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });

  // Ensure required fields are present
  if (!cleaned["@context"]) {
    cleaned["@context"] = "https://schema.org";
  }

  return cleaned;
}

// Utility to merge multiple structured data objects
export function mergeStructuredData(
  ...schemas: StructuredData[]
): StructuredData[] {
  return schemas.map(cleanStructuredData);
}

// Generate structured data for search results
export function generateSearchResultsSchema({
  query,
  totalResults,
  results,
  url,
}: {
  query: string;
  totalResults: number;
  results: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  url: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Résultats de recherche pour "${query}"`,
    description: `${totalResults} résultats trouvés pour "${query}"`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
      itemListElement: results.map((result, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: result.title,
          description: result.description,
          url: result.url,
        },
      })),
    },
    potentialAction: {
      "@type": "SearchAction",
      query,
      target: url,
    },
  };
}
