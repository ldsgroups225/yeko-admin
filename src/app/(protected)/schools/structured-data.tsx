import { StaticStructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

/**
 * Structured data for schools pages
 * These are private pages but we include minimal structured data for internal navigation
 */

// Main schools page structured data
export function SchoolsStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Écoles", url: "/schools" },
  ]);

  // Schools CollectionPage schema
  const schoolsPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gestion des écoles - Yeko Admin",
    description:
      "Interface de gestion des établissements scolaires - ajout, modification et suivi des écoles",
    url: `${siteConfig.url}/schools`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "EducationalOrganization",
      name: "Établissements scolaires",
      description: "Gestion des écoles et institutions éducatives",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Liste des écoles",
      description:
        "Collection des établissements scolaires gérés par la plateforme",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs scolaires",
    },
  };

  // Schools statistics schema
  const schoolsStatsSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Statistiques des écoles - Yeko Admin",
    description:
      "Données statistiques sur les établissements scolaires, élèves et enseignants",
    creator: {
      "@type": "EducationalOrganization",
      name: siteConfig.creator,
    },
    about: [
      {
        "@type": "Thing",
        name: "Écoles",
        description: "Nombre total d'établissements scolaires",
      },
      {
        "@type": "Thing",
        name: "Élèves",
        description: "Nombre total d'élèves inscrits",
      },
      {
        "@type": "Thing",
        name: "Enseignants",
        description: "Nombre total d'enseignants actifs",
      },
    ],
    inLanguage: "fr-FR",
    dateModified: new Date().toISOString(),
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="schools-breadcrumb" />
      <StaticStructuredData data={schoolsPageSchema} id="schools-page" />
      <StaticStructuredData data={schoolsStatsSchema} id="schools-statistics" />
    </>
  );
}

// School detail page structured data
export function SchoolDetailStructuredData({
  school,
}: {
  school: {
    id: string;
    name: string;
    code: string;
    city: string;
    email: string;
    phone: string;
    address?: string | null;
    status: string;
    is_technical_education: boolean | null;
    studentCount: number;
  };
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Écoles", url: "/schools" },
    { name: school.name, url: `/schools/${school.id}` },
  ]);

  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    identifier: school.code,
    url: `${siteConfig.url}/schools/${school.id}`,
    email: school.email,
    telephone: school.phone,
    address: school.address
      ? {
          "@type": "PostalAddress",
          addressLocality: school.city,
          addressCountry: "CI",
          streetAddress: school.address,
        }
      : {
          "@type": "PostalAddress",
          addressLocality: school.city,
          addressCountry: "CI",
        },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    educationalLevel: school.is_technical_education
      ? "Enseignement technique"
      : "Enseignement général",
    numberOfStudents: school.studentCount,
    status: school.status === "private" ? "Active" : "En attente",
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Élèves et enseignants",
    },
  };

  const schoolPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${school.name} - Détails - Yeko Admin`,
    description: `Informations détaillées sur l'établissement scolaire ${school.name}`,
    url: `${siteConfig.url}/schools/${school.id}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: schoolSchema,
    mainEntity: schoolSchema,
  };

  return (
    <>
      <StaticStructuredData
        data={breadcrumbSchema}
        id="school-detail-breadcrumb"
      />
      <StaticStructuredData data={schoolSchema} id="school-organization" />
      <StaticStructuredData data={schoolPageSchema} id="school-detail-page" />
    </>
  );
}

// New school page structured data
export function NewSchoolStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Écoles", url: "/schools" },
    { name: "Nouvelle école", url: "/schools/new" },
  ]);

  const newSchoolPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Créer une nouvelle école - Yeko Admin",
    description:
      "Formulaire de création d'un nouvel établissement scolaire dans la plateforme",
    url: `${siteConfig.url}/schools/new`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "EducationalOrganization",
      name: "Nouvel établissement scolaire",
      description: "Création d'un nouvel établissement éducatif",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs scolaires",
    },
  };

  return (
    <>
      <StaticStructuredData
        data={breadcrumbSchema}
        id="new-school-breadcrumb"
      />
      <StaticStructuredData data={newSchoolPageSchema} id="new-school-page" />
    </>
  );
}

// Generic school section structured data generator
export function SchoolSectionStructuredData({
  sectionName,
  sectionPath,
  description,
  schoolId,
  schoolName,
}: {
  sectionName: string;
  sectionPath: string;
  description: string;
  schoolId?: string;
  schoolName?: string;
}) {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Écoles", url: "/schools" },
  ];

  if (schoolId && schoolName) {
    breadcrumbItems.push({ name: schoolName, url: `/schools/${schoolId}` });
  }

  breadcrumbItems.push({ name: sectionName, url: sectionPath });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const sectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${sectionName} - ${schoolName || "Écoles"} - Yeko Admin`,
    description,
    url: `${siteConfig.url}${sectionPath}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "EducationalOrganization",
      name: schoolName || "Établissement scolaire",
      description,
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Utilisateurs de la plateforme éducative",
    },
  };

  return (
    <>
      <StaticStructuredData
        data={breadcrumbSchema}
        id={`${sectionPath.replace(/\//g, "-")}-breadcrumb`}
      />
      <StaticStructuredData
        data={sectionPageSchema}
        id={`${sectionPath.replace(/\//g, "-")}-page`}
      />
    </>
  );
}
