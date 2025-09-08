import { StaticStructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/structured-data";

/**
 * Structured data for dashboard pages
 * These are private pages but we include minimal structured data for internal navigation
 */

// Main dashboard page structured data
export function DashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
  ]);

  // Dashboard WebPage schema (private, no indexing)
  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tableau de bord - Yeko Admin",
    description:
      "Vue d'ensemble de votre plateforme de gestion scolaire - statistiques, écoles récentes et données d'effectifs",
    url: `${siteConfig.url}/dashboard`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs scolaires",
    },
    about: {
      "@type": "Thing",
      name: "Gestion scolaire",
      description: "Outils de gestion et d'administration scolaire",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Tableau de bord Yeko Admin",
      applicationCategory: "EducationalApplication",
      description:
        "Interface de gestion centralisée pour les établissements scolaires",
    },
  };

  // Dashboard statistics schema
  const statisticsSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Statistiques de la plateforme Yeko Admin",
    description:
      "Données statistiques sur les écoles, élèves et performances de la plateforme",
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
      {
        "@type": "Thing",
        name: "Classes",
        description: "Nombre total de classes organisées",
      },
    ],
    inLanguage: "fr-FR",
    dateModified: new Date().toISOString(),
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="dashboard-breadcrumb" />
      <StaticStructuredData data={dashboardSchema} id="dashboard-webpage" />
      <StaticStructuredData data={statisticsSchema} id="dashboard-statistics" />
    </>
  );
}

// Schools section structured data
export function SchoolsDashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Écoles", url: "/dashboard/schools" },
  ]);

  const schoolsPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gestion des écoles - Yeko Admin",
    description:
      "Interface de gestion des établissements scolaires - ajout, modification et suivi des écoles",
    url: `${siteConfig.url}/dashboard/schools`,
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
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="schools-breadcrumb" />
      <StaticStructuredData data={schoolsPageSchema} id="schools-page" />
    </>
  );
}

// Students section structured data
export function StudentsDashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Élèves", url: "/dashboard/students" },
  ]);

  const studentsPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gestion des élèves - Yeko Admin",
    description:
      "Interface de gestion des élèves - inscription, suivi académique et données personnelles",
    url: `${siteConfig.url}/dashboard/students`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "Person",
      name: "Élèves",
      description: "Gestion des dossiers et du suivi des élèves",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Liste des élèves",
      description: "Collection des élèves inscrits dans les établissements",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs et enseignants",
    },
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="students-breadcrumb" />
      <StaticStructuredData data={studentsPageSchema} id="students-page" />
    </>
  );
}

// Teachers section structured data
export function TeachersDashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Enseignants", url: "/dashboard/teachers" },
  ]);

  const teachersPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gestion des enseignants - Yeko Admin",
    description:
      "Interface de gestion du personnel enseignant - profils, matières et affectations",
    url: `${siteConfig.url}/dashboard/teachers`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "Person",
      name: "Enseignants",
      description: "Gestion des profils et données du personnel enseignant",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Liste des enseignants",
      description: "Collection du personnel enseignant des établissements",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs scolaires",
    },
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="teachers-breadcrumb" />
      <StaticStructuredData data={teachersPageSchema} id="teachers-page" />
    </>
  );
}

// Classes section structured data
export function ClassesDashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Classes", url: "/dashboard/classes" },
  ]);

  const classesPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gestion des classes - Yeko Admin",
    description:
      "Interface de gestion des classes - organisation, effectifs et emplois du temps",
    url: `${siteConfig.url}/dashboard/classes`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "EducationalOrganization",
      name: "Classes scolaires",
      description: "Organisation et gestion des classes et groupes d'élèves",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Liste des classes",
      description: "Collection des classes organisées dans les établissements",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs et enseignants",
    },
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="classes-breadcrumb" />
      <StaticStructuredData data={classesPageSchema} id="classes-page" />
    </>
  );
}

// Settings section structured data
export function SettingsDashboardStructuredData() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: "Paramètres", url: "/dashboard/settings" },
  ]);

  const settingsPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Paramètres - Yeko Admin",
    description:
      "Configuration et personnalisation de votre plateforme de gestion scolaire",
    url: `${siteConfig.url}/dashboard/settings`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": "SoftwareApplication",
      name: "Configuration Yeko Admin",
      description: "Paramètres et options de configuration de la plateforme",
    },
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Administrateurs système",
    },
  };

  return (
    <>
      <StaticStructuredData data={breadcrumbSchema} id="settings-breadcrumb" />
      <StaticStructuredData data={settingsPageSchema} id="settings-page" />
    </>
  );
}

// Generic dashboard section structured data generator
export function DashboardSectionStructuredData({
  sectionName,
  sectionPath,
  description,
  itemType = "Thing",
}: {
  sectionName: string;
  sectionPath: string;
  description: string;
  itemType?: string;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Tableau de bord", url: "/dashboard" },
    { name: sectionName, url: sectionPath },
  ]);

  const sectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${sectionName} - Yeko Admin`,
    description,
    url: `${siteConfig.url}${sectionPath}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "fr-FR",
    about: {
      "@type": itemType,
      name: sectionName,
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
