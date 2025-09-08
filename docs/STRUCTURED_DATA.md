# Structured Data (JSON-LD) System

This document describes the comprehensive structured data system implemented for Yeko Admin, an educational platform for school management.

## Overview

The structured data system provides:
- **Schema.org compliant JSON-LD** for better search engine understanding
- **Educational-specific schemas** for courses, events, and profiles
- **Automatic breadcrumb generation** for navigation
- **React components** for easy integration
- **Validation and utilities** for data quality

## Core Components

### 1. Structured Data Library (`src/lib/structured-data.ts`)

Central library containing all schema generators:

```typescript
import { 
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  commonStructuredData 
} from '@/lib/structured-data';

// Generate organization schema
const orgSchema = generateOrganizationSchema();

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbSchema([
  { name: "Accueil", url: "/" },
  { name: "Tableau de bord", url: "/dashboard" }
]);
```

### 2. React Components (`src/components/StructuredData.tsx`)

Easy-to-use React components for adding structured data:

```typescript
import { StructuredData, StaticStructuredData } from '@/components/StructuredData';

// Client-side structured data
<StructuredData data={schema} />

// Server-side structured data (SSR)
<StaticStructuredData data={schema} />
```

### 3. Layout Components (`src/components/layout/StructuredDataLayout.tsx`)

Pre-configured layout components for common page types:

```typescript
import { StructuredDataLayout, DashboardStructuredDataLayout } from '@/components/layout/StructuredDataLayout';

// Root layout with organization schemas
<StructuredDataLayout>
  {children}
</StructuredDataLayout>

// Dashboard with breadcrumbs
<DashboardStructuredDataLayout title="Élèves">
  {children}
</DashboardStructuredDataLayout>
```

## Available Schemas

### 1. Organization Schema

For the main educational organization:

```typescript
const orgSchema = generateOrganizationSchema();
```

**Generated Schema:**
- Type: `EducationalOrganization`
- Includes: name, description, logo, contact info
- Educational focus: school management platform

### 2. Website Schema

For the main website:

```typescript
const websiteSchema = generateWebsiteSchema();
```

**Features:**
- Search action integration
- Publisher information
- Copyright details

### 3. Software Application Schema

For the platform itself:

```typescript
const appSchema = generateSoftwareApplicationSchema();
```

**Includes:**
- Application category: Educational
- Features list
- Accessibility information
- Pricing (freemium)

### 4. Educational Content Schemas

#### Course Schema
```typescript
const courseSchema = generateCourseSchema({
  name: "Mathématiques CM2",
  description: "Cours de mathématiques pour CM2",
  provider: "École Primaire",
  instructor: "Mme Dupont",
  courseCode: "MATH-CM2",
  educationalLevel: "Primaire",
  subject: "Mathématiques",
  duration: "P1Y",
  url: "/courses/math-cm2"
});
```

#### Person Schema (Teachers/Students)
```typescript
const personSchema = generatePersonSchema({
  name: "Marie Dupont",
  jobTitle: "Enseignante",
  description: "Professeure de mathématiques",
  url: "/profile/marie-dupont",
  affiliation: "École Primaire Victor Hugo",
  expertise: ["Mathématiques", "Sciences"]
});
```

### 5. Event Schema

For school events:

```typescript
const eventSchema = generateEventSchema({
  name: "Réunion parents-professeurs",
  description: "Rencontre avec les enseignants",
  startDate: "2024-03-15T18:00:00",
  endDate: "2024-03-15T20:00:00",
  location: "Salle polyvalente",
  organizer: "École Primaire",
  url: "/events/reunion-parents"
});
```

### 6. FAQ Schema

For help and documentation pages:

```typescript
const faqSchema = generateFAQSchema([
  {
    question: "Comment créer un compte élève ?",
    answer: "Rendez-vous dans la section 'Élèves' et cliquez sur 'Ajouter un élève'."
  }
]);
```

### 7. Breadcrumb Schema

Automatic navigation breadcrumbs:

```typescript
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Accueil", url: "/" },
  { name: "Tableau de bord", url: "/dashboard" },
  { name: "Élèves", url: "/dashboard/students" }
]);
```

## Educational-Specific Utilities

### 1. Educational Content Schema

```typescript
import { generateEducationalContentSchema } from '@/lib/structured-data-utils';

const contentSchema = generateEducationalContentSchema({
  title: "Guide d'utilisation",
  description: "Comment utiliser la plateforme",
  type: "tutorial",
  level: "débutant",
  subject: "Formation",
  duration: "PT30M",
  url: "/guides/getting-started"
});
```

### 2. School Event Schema

```typescript
import { generateSchoolEventSchema } from '@/lib/structured-data-utils';

const schoolEventSchema = generateSchoolEventSchema({
  name: "Sortie scolaire",
  description: "Visite du musée des sciences",
  startDate: "2024-04-10T09:00:00",
  location: "Musée des Sciences",
  organizer: "École Primaire",
  url: "/events/museum-visit",
  audience: "Élèves de CE2"
});
```

### 3. Educational Person Schema

```typescript
import { generateEducationalPersonSchema } from '@/lib/structured-data-utils';

const teacherSchema = generateEducationalPersonSchema({
  name: "Pierre Martin",
  role: "enseignant",
  description: "Professeur d'histoire-géographie",
  url: "/profile/pierre-martin",
  institution: "Collège Jean Moulin",
  subjects: ["Histoire", "Géographie"],
  qualifications: ["CAPES Histoire-Géographie"],
  experience: "15 ans d'enseignement"
});
```

## Usage Examples

### 1. Home Page

```typescript
// app/page.tsx
import { StaticStructuredData } from '@/components/StructuredData';
import { commonStructuredData } from '@/lib/structured-data';

export default function HomePage() {
  const homeSchemas = commonStructuredData.home();

  return (
    <>
      {homeSchemas.map((schema, index) => (
        <StaticStructuredData 
          key={index}
          data={schema} 
          id={`home-schema-${index}`}
        />
      ))}
      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

### 2. Dashboard Page

```typescript
// app/dashboard/students/page.tsx
import { DashboardStructuredDataLayout } from '@/components/layout/StructuredDataLayout';

export default function StudentsPage() {
  return (
    <DashboardStructuredDataLayout title="Élèves">
      <div>
        {/* Dashboard content */}
      </div>
    </DashboardStructuredDataLayout>
  );
}
```

### 3. Profile Page

```typescript
// app/profile/[username]/page.tsx
import { StaticStructuredData } from '@/components/StructuredData';
import { generateEducationalPersonSchema } from '@/lib/structured-data-utils';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = getUserData(params.username);
  
  const personSchema = generateEducationalPersonSchema({
    name: user.name,
    role: user.role,
    url: `/profile/${params.username}`,
    institution: user.school,
    subjects: user.subjects
  });

  return (
    <>
      <StaticStructuredData data={personSchema} />
      <div>
        {/* Profile content */}
      </div>
    </>
  );
}
```

### 4. Course Page

```typescript
// app/courses/[slug]/page.tsx
import { StaticStructuredData } from '@/components/StructuredData';
import { generateCourseSchema } from '@/lib/structured-data';

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseData(params.slug);
  
  const courseSchema = generateCourseSchema({
    name: course.title,
    description: course.description,
    provider: course.school,
    instructor: course.teacher,
    educationalLevel: course.level,
    subject: course.subject,
    url: `/courses/${params.slug}`
  });

  return (
    <>
      <StaticStructuredData data={courseSchema} />
      <div>
        {/* Course content */}
      </div>
    </>
  );
}
```

### 5. Event Page

```typescript
// app/events/[id]/page.tsx
import { StaticStructuredData } from '@/components/StructuredData';
import { generateSchoolEventSchema } from '@/lib/structured-data-utils';

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEventData(params.id);
  
  const eventSchema = generateSchoolEventSchema({
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    organizer: event.organizer,
    url: `/events/${params.id}`
  });

  return (
    <>
      <StaticStructuredData data={eventSchema} />
      <div>
        {/* Event content */}
      </div>
    </>
  );
}
```

### 6. Help/FAQ Page

```typescript
// app/help/page.tsx
import { HelpStructuredDataLayout } from '@/components/layout/StructuredDataLayout';

const faqs = [
  {
    question: "Comment ajouter un nouvel élève ?",
    answer: "Allez dans 'Élèves' > 'Ajouter un élève' et remplissez le formulaire."
  },
  {
    question: "Comment consulter les notes ?",
    answer: "Les notes sont disponibles dans l'onglet 'Évaluations' de chaque élève."
  }
];

export default function HelpPage() {
  return (
    <HelpStructuredDataLayout faqs={faqs}>
      <div>
        {/* Help content */}
      </div>
    </HelpStructuredDataLayout>
  );
}
```

## Client-Side Dynamic Updates

### Using the Hook

```typescript
// components/DynamicProfile.tsx
import { useStructuredData } from '@/components/StructuredData';
import { generatePersonSchema } from '@/lib/structured-data';

export function DynamicProfile({ user }: { user: User }) {
  // Update structured data when user changes
  useStructuredData(
    generatePersonSchema({
      name: user.name,
      jobTitle: user.role,
      url: `/profile/${user.username}`,
      description: user.bio
    }),
    'dynamic-profile'
  );

  return <div>{/* Profile UI */}</div>;
}
```

### Conditional Structured Data

```typescript
import { ConditionalStructuredData } from '@/components/StructuredData';

<ConditionalStructuredData
  condition={user.isTeacher}
  data={generatePersonSchema({
    name: user.name,
    jobTitle: "Enseignant",
    url: `/profile/${user.username}`
  })}
/>
```

## Validation and Testing

### Development Validation

The system includes automatic validation in development mode:

```typescript
// Automatically validates in development
<StructuredData data={schema} />
```

### Manual Validation

```typescript
import { validateStructuredData } from '@/lib/structured-data';

const isValid = validateStructuredData(schema);
if (!isValid) {
  console.error('Invalid structured data:', schema);
}
```

### Testing Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **JSON-LD Playground**: https://json-ld.org/playground/

## Best Practices

### 1. Schema Selection

- Use `EducationalOrganization` for schools
- Use `Course` for educational content
- Use `Person` for teachers and students
- Use `EducationEvent` for school events

### 2. Required Fields

Always include:
- `@context`: "https://schema.org"
- `@type`: Appropriate schema type
- `name`: Clear, descriptive name
- `url`: Canonical URL

### 3. Educational Context

- Use French language (`inLanguage: "fr-FR"`)
- Include educational levels when relevant
- Specify subjects and competencies
- Add accessibility information

### 4. Performance

- Use `StaticStructuredData` for SSR
- Use `StructuredData` for client-side updates
- Avoid duplicate schemas on the same page
- Keep schemas focused and relevant

### 5. SEO Optimization

- Include all relevant educational properties
- Use descriptive names and descriptions
- Add images when available
- Include contact and location information

## Common Patterns

### Page-Level Schemas

```typescript
// Layout with multiple schemas
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StructuredDataLayout>
      {children}
    </StructuredDataLayout>
  );
}
```

### Dynamic Content

```typescript
// Update schema based on content
useEffect(() => {
  if (course) {
    const schema = generateCourseSchema({
      name: course.title,
      description: course.description,
      // ... other properties
    });
    
    // Schema automatically updates
  }
}, [course]);
```

### Error Handling

```typescript
try {
  const schema = generatePersonSchema(personData);
  return <StructuredData data={schema} />;
} catch (error) {
  console.error('Failed to generate schema:', error);
  return null; // Graceful fallback
}
```

## Troubleshooting

### Common Issues

1. **Missing Required Fields**: Ensure all required properties are present
2. **Invalid Dates**: Use ISO 8601 format for dates
3. **Duplicate IDs**: Use unique IDs for multiple schemas
4. **Invalid URLs**: Ensure URLs are absolute and valid

### Debug Mode

Enable detailed logging in development:

```typescript
// Set in environment
NEXT_PUBLIC_DEBUG_STRUCTURED_DATA=true
```

### Validation Errors

Check browser console for validation warnings in development mode.

## Migration Guide

### From Basic Meta Tags

1. Replace static meta tags with structured data
2. Use appropriate schema types
3. Include educational context
4. Test with validation tools

### Adding to Existing Pages

1. Import structured data components
2. Generate appropriate schemas
3. Add to page layouts
4. Validate implementation

## Future Enhancements

- **Multi-language Support**: i18n structured data
- **Advanced Educational Schemas**: Curriculum, assessments
- **Integration with CMS**: Dynamic schema generation
- **Analytics Integration**: Track structured data performance