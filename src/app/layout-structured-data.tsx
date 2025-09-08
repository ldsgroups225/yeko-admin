import { StaticStructuredData } from "@/components/StructuredData";
import { commonStructuredData } from "@/lib/structured-data";

/**
 * Example implementation of structured data in the root layout
 * This file demonstrates how to integrate structured data into your Next.js app
 *
 * Usage: Import and use in your app/layout.tsx file
 */

export function RootLayoutWithStructuredData({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate common structured data for all pages
  const homeSchemas = commonStructuredData.home();

  return (
    <html lang="fr">
      <head>
        {/* Organization Schema - appears on all pages */}
        <StaticStructuredData data={homeSchemas[0]} id="organization-schema" />

        {/* Website Schema - appears on all pages */}
        <StaticStructuredData data={homeSchemas[1]} id="website-schema" />

        {/* Software Application Schema - appears on all pages */}
        <StaticStructuredData data={homeSchemas[2]} id="software-schema" />
      </head>
      <body>{children}</body>
    </html>
  );
}

/**
 * Example page with structured data
 * This shows how to add page-specific structured data
 */

import { generateBreadcrumbsFromPath } from "@/lib/structured-data-utils";

export function ExamplePageWithStructuredData({
  pathname = "/dashboard/students",
}: {
  pathname?: string;
}) {
  // Generate breadcrumbs from current path
  const breadcrumbSchema = generateBreadcrumbsFromPath(pathname, {
    dashboard: "Tableau de bord",
    students: "Élèves",
    teachers: "Enseignants",
    classes: "Classes",
    events: "Événements",
    settings: "Paramètres",
  });

  return (
    <>
      {/* Page-specific breadcrumb schema */}
      <StaticStructuredData data={breadcrumbSchema} id="page-breadcrumb" />

      <main>
        <h1>Page Content</h1>
        {/* Your page content here */}
      </main>
    </>
  );
}

/**
 * Example profile page with person schema
 */

import { generateEducationalPersonSchema } from "@/lib/structured-data-utils";

export function ExampleProfilePage({
  user = {
    name: "Marie Dupont",
    role: "enseignant" as const,
    description: "Professeure de mathématiques avec 10 ans d'expérience",
    username: "marie-dupont",
    institution: "École Primaire Victor Hugo",
    subjects: ["Mathématiques", "Sciences"],
    qualifications: ["Master en Mathématiques", "CAPES"],
    experience: "10 ans d'enseignement en primaire",
  },
}: {
  user?: {
    name: string;
    role: "enseignant" | "élève" | "administrateur" | "parent";
    description?: string;
    username: string;
    institution?: string;
    subjects?: string[];
    qualifications?: string[];
    experience?: string;
  };
}) {
  // Generate person schema for the profile
  const personSchema = generateEducationalPersonSchema({
    name: user.name,
    role: user.role,
    description: user.description,
    url: `/profile/${user.username}`,
    institution: user.institution,
    subjects: user.subjects,
    qualifications: user.qualifications,
    experience: user.experience,
  });

  // Generate breadcrumbs for profile page
  const breadcrumbSchema = generateBreadcrumbsFromPath(
    `/profile/${user.username}`,
    {
      profile: "Profils",
    },
  );

  return (
    <>
      {/* Person schema for the profile */}
      <StaticStructuredData data={personSchema} id="person-schema" />

      {/* Breadcrumb navigation */}
      <StaticStructuredData data={breadcrumbSchema} id="profile-breadcrumb" />

      <main>
        <h1>Profil de {user.name}</h1>
        <p>{user.description}</p>
        {/* Profile content */}
      </main>
    </>
  );
}

/**
 * Example course page with course schema
 */

import { generateCourseSchema } from "@/lib/structured-data";

export function ExampleCoursePage({
  course = {
    name: "Mathématiques CM2",
    description:
      "Cours de mathématiques pour les élèves de CM2, couvrant les quatre opérations, les fractions et la géométrie",
    provider: "École Primaire Victor Hugo",
    instructor: "Marie Dupont",
    courseCode: "MATH-CM2-2024",
    educationalLevel: "Primaire - CM2",
    subject: "Mathématiques",
    duration: "P1Y",
    slug: "mathematiques-cm2",
  },
}: {
  course?: {
    name: string;
    description: string;
    provider: string;
    instructor: string;
    courseCode: string;
    educationalLevel: string;
    subject: string;
    duration: string;
    slug: string;
  };
}) {
  // Generate course schema
  const courseSchema = generateCourseSchema({
    name: course.name,
    description: course.description,
    provider: course.provider,
    instructor: course.instructor,
    courseCode: course.courseCode,
    educationalLevel: course.educationalLevel,
    subject: course.subject,
    duration: course.duration,
    url: `/courses/${course.slug}`,
  });

  // Generate breadcrumbs
  const breadcrumbSchema = generateBreadcrumbsFromPath(
    `/courses/${course.slug}`,
    {
      courses: "Cours",
    },
  );

  return (
    <>
      {/* Course schema */}
      <StaticStructuredData data={courseSchema} id="course-schema" />

      {/* Breadcrumb navigation */}
      <StaticStructuredData data={breadcrumbSchema} id="course-breadcrumb" />

      <main>
        <h1>{course.name}</h1>
        <p>{course.description}</p>
        <div>
          <strong>Enseignant:</strong> {course.instructor}
        </div>
        <div>
          <strong>Niveau:</strong> {course.educationalLevel}
        </div>
        <div>
          <strong>Matière:</strong> {course.subject}
        </div>
        {/* Course content */}
      </main>
    </>
  );
}

/**
 * Example event page with event schema
 */

import { generateSchoolEventSchema } from "@/lib/structured-data-utils";

export function ExampleEventPage({
  event = {
    name: "Réunion parents-professeurs",
    description:
      "Rencontre entre les parents et les enseignants pour faire le point sur la progression des élèves",
    startDate: "2024-03-15T18:00:00",
    endDate: "2024-03-15T20:00:00",
    location: "Salle polyvalente de l'école",
    organizer: "École Primaire Victor Hugo",
    id: "reunion-parents-2024-03",
  },
}: {
  event?: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    id: string;
  };
}) {
  // Generate event schema
  const eventSchema = generateSchoolEventSchema({
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    organizer: event.organizer,
    url: `/events/${event.id}`,
    audience: "Parents et enseignants",
  });

  // Generate breadcrumbs
  const breadcrumbSchema = generateBreadcrumbsFromPath(`/events/${event.id}`, {
    events: "Événements",
  });

  return (
    <>
      {/* Event schema */}
      <StaticStructuredData data={eventSchema} id="event-schema" />

      {/* Breadcrumb navigation */}
      <StaticStructuredData data={breadcrumbSchema} id="event-breadcrumb" />

      <main>
        <h1>{event.name}</h1>
        <p>{event.description}</p>
        <div>
          <strong>Date:</strong>{" "}
          {new Date(event.startDate).toLocaleDateString("fr-FR")}
        </div>
        <div>
          <strong>Heure:</strong>{" "}
          {new Date(event.startDate).toLocaleTimeString("fr-FR")} -{" "}
          {new Date(event.endDate).toLocaleTimeString("fr-FR")}
        </div>
        <div>
          <strong>Lieu:</strong> {event.location}
        </div>
        {/* Event content */}
      </main>
    </>
  );
}

/**
 * Example help page with FAQ schema
 */

import { generateFAQSchema } from "@/lib/structured-data";

export function ExampleHelpPage() {
  const faqs = [
    {
      question: "Comment ajouter un nouvel élève ?",
      answer:
        "Pour ajouter un nouvel élève, rendez-vous dans la section 'Élèves' du tableau de bord, puis cliquez sur le bouton 'Ajouter un élève'. Remplissez le formulaire avec les informations de l'élève et validez.",
    },
    {
      question: "Comment consulter les notes d'un élève ?",
      answer:
        "Les notes sont disponibles dans le profil de chaque élève. Cliquez sur le nom de l'élève dans la liste, puis accédez à l'onglet 'Évaluations' pour voir toutes ses notes.",
    },
    {
      question: "Comment contacter un parent ?",
      answer:
        "Les informations de contact des parents sont disponibles dans le profil de l'élève. Vous pouvez également utiliser le système de messagerie intégré pour envoyer des messages directement.",
    },
    {
      question: "Comment créer une nouvelle classe ?",
      answer:
        "Dans la section 'Classes', cliquez sur 'Nouvelle classe'. Définissez le nom de la classe, le niveau, et assignez un enseignant principal. Vous pourrez ensuite ajouter des élèves à cette classe.",
    },
  ];

  // Generate FAQ schema
  const faqSchema = generateFAQSchema(faqs);

  // Generate breadcrumbs
  const breadcrumbSchema = generateBreadcrumbsFromPath("/help", {
    help: "Aide",
  });

  return (
    <>
      {/* FAQ schema */}
      <StaticStructuredData data={faqSchema} id="faq-schema" />

      {/* Breadcrumb navigation */}
      <StaticStructuredData data={breadcrumbSchema} id="help-breadcrumb" />

      <main>
        <h1>Aide et Questions Fréquentes</h1>
        <div>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
